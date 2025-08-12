import GoogleAdd from "./GoogleAdd";

const AdSenseAdc = (Id) => {
  const adId=Id.adId;
  let slot='8131115980';
  const slots=['8131115980'];
  if(Id==0)
  {
    slot=slots[Id];
    return (
      <GoogleAdd aid={adId} adSlot={slot} />
    );
  }else{
    return (
      <GoogleAdd aid={adId} adSlot="8131115980" />
    );
  }
  

};

export default AdSenseAdc;
