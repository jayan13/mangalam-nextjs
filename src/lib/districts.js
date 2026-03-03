import districts from '../data/districts.json';

/**
 * Gets the list of all districts.
 */
export function getDistricts() {
    return districts;
}

/**
 * Gets a specific district by its ID.
 * @param {number|string} id 
 */
export function getDistrictById(id) {
    const districtId = parseInt(id);
    return districts.find(d => d.id === districtId) || null;
}

/**
 * Gets the name of a district by its ID.
 * @param {number|string} id 
 */
export function getDistrictNameById(id) {
    const district = getDistrictById(id);
    return district ? district.name : '';
}
