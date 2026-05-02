import db from '@/lib/db';
import { unstable_cache } from 'next/cache';
import { NextResponse } from 'next/server';

function toJsonSafe(value) {
  if (typeof value === 'bigint') return value.toString();
  return value;
}

function normalizeRows(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => {
    const plain = {};
    for (const [key, val] of Object.entries(row || {})) {
      plain[key] = toJsonSafe(val);
    }
    return plain;
  });
}

const ALLIANCE_ORDER = ['LDF','DMK','TMC','UPA','UDF','NDA','INC','AIADMK','TVK','MNM','URF','LEFT+INC','BSP-SP','OTH'];
const ALLIANCE_ORDER_INDEX = new Map(ALLIANCE_ORDER.map((name, idx) => [name, idx]));

function sortAlliances(alliances) {
  if (!Array.isArray(alliances)) return [];
  return alliances.slice().sort((a, b) => {
    const ai = ALLIANCE_ORDER_INDEX.has(a.name) ? ALLIANCE_ORDER_INDEX.get(a.name) : Number.POSITIVE_INFINITY;
    const bi = ALLIANCE_ORDER_INDEX.has(b.name) ? ALLIANCE_ORDER_INDEX.get(b.name) : Number.POSITIVE_INFINITY;
    if (ai !== bi) return ai - bi;
    return String(a.name || '').localeCompare(String(b.name || ''));
  });
}

const getElectionResults = unstable_cache(
  async (stateName) => {
    let sqlQuery = `
      SELECT 
        s.states_id,
        s.state_name,
        s.total_no_of_constituency AS total_seats,
        p.parties_id,
        p.party_name,
        p.display_order AS party_display_order,
        p.aliance_group,
        p.level,
        p.logo,
        p.no_of_seats AS party_contested_seats,
        sr.leading_count,
        sr.won_count
      FROM state_wise_result sr
      INNER JOIN states s ON sr.states_id = s.states_id
      INNER JOIN parties p ON sr.parties_id = p.parties_id
      WHERE s.state_name IN ('Kerala', 'West Bengal', 'Tamil Nadu', 'Puducherry', 'Assam')
    `;

    const params = [];

    if (stateName) {
      sqlQuery += ` AND s.state_name = ?`;
      params.push(stateName);
    }

    const [rows] = await db.query(sqlQuery, params);
    return normalizeRows(rows);
  },
  ['election-results'],
  { revalidate: parseInt('120'), tags: ['election-results'] }
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const stateName = searchParams.get('state');

    const results = await getElectionResults(stateName);
    
    // Process data for the response
    let processedData;
    if (stateName) {
      processedData = processSingleStateData(results);
    } else {
      processedData = processAllStatesData(results);
    }
    
    return NextResponse.json(
      {
        success: true,
        data: processedData,
        currentState: stateName || 'Kerala',
      },
      {
        status: 200,
        headers: {
          'Cache-Control': `public, s-maxage=120, stale-while-revalidate=60`,
        },
      }
    );
    
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch election results' },
      { status: 500 }
    );
  }
}

function processSingleStateData(rawData) {
  if (rawData.length === 0) return null;
  
  const stateData = {
    states_id: rawData[0].states_id,
    state_name: rawData[0].state_name,
    total_seats: rawData[0].total_seats,
    alliances: new Map(),
    parties: []
  };
  
  rawData.forEach(item => {
    // Process alliances
    if (!stateData.alliances.has(item.aliance_group)) {
      stateData.alliances.set(item.aliance_group, {
        name: item.aliance_group,
        leading: 0,
        won: 0,
        parties: []
      });
    }
    
    const alliance = stateData.alliances.get(item.aliance_group);
    alliance.leading += Number(item.leading_count) || 0;
    alliance.won += Number(item.won_count) || 0;
    
    // Process parties
    const partyData = {
      parties_id: item.parties_id,
      party_name: item.party_name,
      party_display_order: item.party_display_order,
      aliance_group: item.aliance_group,
      level: item.level,
      logo: item.logo,
      contested_seats: item.party_contested_seats,
      leading_count: item.leading_count,
      won_count: item.won_count
    };
    
    stateData.parties.push(partyData);
    alliance.parties.push(partyData);
  });
  
  // Sort parties by display order
  stateData.parties.sort((a, b) => a.party_display_order - b.party_display_order);
  stateData.alliances = sortAlliances(Array.from(stateData.alliances.values()));
  
  return stateData;
}

function processAllStatesData(rawData) {
  const statesMap = new Map();
  
  rawData.forEach(item => {
    if (!statesMap.has(item.state_name)) {
      statesMap.set(item.state_name, {
        states_id: item.states_id,
        state_name: item.state_name,
        total_seats: item.total_seats,
        alliances: new Map(),
        parties: []
      });
    }
    
    const state = statesMap.get(item.state_name);
    
    // Process alliances
    if (!state.alliances.has(item.aliance_group)) {
      state.alliances.set(item.aliance_group, {
        name: item.aliance_group,
        leading: 0,
        won: 0,
        parties: []
      });
    }
    
    const alliance = state.alliances.get(item.aliance_group);
    alliance.leading += Number(item.leading_count) || 0;
    alliance.won += Number(item.won_count) || 0;
    
    // Process parties
    const partyData = {
      parties_id: item.parties_id,
      party_name: item.party_name,
      party_display_order: item.party_display_order,
      aliance_group: item.aliance_group,
      level: item.level,
      logo: item.logo,
      contested_seats: item.party_contested_seats,
      leading_count: item.leading_count,
      won_count: item.won_count
    };
    
    state.parties.push(partyData);
    alliance.parties.push(partyData);
  });
  
  // Convert to array and sort by display order
  const result = Array.from(statesMap.values()).map(state => ({
    ...state,
    parties: state.parties.sort((a, b) => a.party_display_order - b.party_display_order),
    alliances: sortAlliances(Array.from(state.alliances.values()))
  }));
  
  // Sort states in specific order
  const stateOrder = ['Kerala', 'Tamil Nadu', 'West Bengal', 'Assam', 'Puducherry'];
  result.sort((a, b) => stateOrder.indexOf(a.state_name) - stateOrder.indexOf(b.state_name));
  
  return result;
}
