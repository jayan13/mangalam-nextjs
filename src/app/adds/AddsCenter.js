import GoogleAdd from "./GoogleAdd";

const AdSenseAdc = ({ adId }) => {
  const slots = ['2210188022', '8131115980'];

  const slot = slots[adId] || '2210188022';

  return <GoogleAdd aid={adId} adSlot={slot} />;
};


export default AdSenseAdc;
