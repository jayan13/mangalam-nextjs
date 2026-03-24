import GoogleAdd from "./GoogleAdd";

const AdSenseAdc = ({ adId }) => {
  const slots = ['8131115980', '2210188022'];

  const slot = slots[adId] || '2210188022';

  return <GoogleAdd aid={adId} adSlot={slot} />;
};


export default AdSenseAdc;
