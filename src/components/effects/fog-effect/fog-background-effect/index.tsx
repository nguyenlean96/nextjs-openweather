import Image from "next/image";
import Fog1 from '../graphic/fog1.png';
import Fog2 from '../graphic/fog2.png';
import Fog3 from '../graphic/fog3.png';
import Fog4 from '../graphic/fog4.png';
import Fog5 from '../graphic/fog5.png';

export default function FogBackgroundEffect() {
  return (
    <>
      <Image src={Fog1} alt="fog" className="fog1" />
      <Image src={Fog2} alt="fog" className="fog2" />
      <Image src={Fog3} alt="fog" className="fog3" />
      <Image src={Fog4} alt="fog" className="fog4" />
      <Image src={Fog5} alt="fog" className="fog5" />
      <Image src={Fog1} alt="fog" className="fog10" />
      <Image src={Fog2} alt="fog" className="fog9" />
      <Image src={Fog3} alt="fog" className="fog8" />
      <Image src={Fog4} alt="fog" className="fog7" />
      <Image src={Fog5} alt="fog" className="fog6" />
    </>
  )
}
