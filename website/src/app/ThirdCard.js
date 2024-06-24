
import Image from 'next/image';
import Linkedin from "./linkedin.png";



const ThirdCard = ({icon, background, co_name, role, description, link}) => {
return(
<div style={{background:"white", borderRadius:"15px", boxShadow: "0px 24px 48px 0 rgba(0,0,0,0.16)", width:"500px"}}>

<div style={{position: "relative", display:"flex", flexDirection: "column"}}>





<Image
src={background}
style={{borderTopLeftRadius: "15px", borderTopRightRadius: "15px",  borderBottom: "5px solid #152A4D", width: "100%", height:"200px"}}
alt="no image"
/>


<Image
src={icon}
style={{borderRadius:"100%", position: "absolute", top: "100%", left: "50%", transform: "translate(-50%, -50%)"}}
alt="no image"
/>
</div>

<div style={{display: "flex", padding: "25px", justifyContent: "flex-end", alignItems: "center"}}>

<a href={link} target="_blank">
  <Image

  src={Linkedin}
  alt="Linkedin"
  width={50}
  style={{borderRadius:"50%"}}
  />
  </a>
</div>

<div style={{gap: "10px", flexDirection: "column", display: "flex", alignItems: "center"}}>
  <h3 style={{color: "#152A4D"}}>{co_name} - <span style={{color: "#17A7E4"}}>Fondateur</span></h3>
  <h3 style={{color: "#152A4D"}}>{role}</h3>
</div>
<p style={{marginTop:"50px", padding: "25px", textAlign: "center"}}>
{description}
</p>

</div>
)

}

export default ThirdCard;


