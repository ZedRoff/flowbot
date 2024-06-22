import logo from "./icon_header.png"
import flo from "./flo.png"
import SvgBurger from "./burger-menu-svgrepo-com.svg"
import Image from 'next/image'
import bot from "./bot.png"
import wave from "./wave.png"
import DevProd from "./dev_prod.png"
export default function Home() {
  return (
   <div>
<header style={{background: "#152A4D",border: "1.5px solid rgba(0,0,0,0.5)", paddingLeft: "15px", paddingRight:"15px", paddingTop: "25px", paddingBottom: "25px", display:"flex",alignItems:"center",justifyContent:"space-between", flexDirection: "row", boxShadow: "0px 24px 48px 0 rgba(0,0,0,0.16)", zIndex:999}}>
 <div style={{display: "flex", gap: "10px", alignItems: "center", justifyContent: "center"}}>


 <Image
  src={logo}
  alt="Logo"
  width={25}
  height={25}
  />
  <h1 style={{color: "white", fontSize: "20px", fontWeight: "600"}}>FloBot</h1>
   </div>
<SvgBurger />
</header>
<section style={{background: "#152A4D",marginTop:"0px", display: "flex", justifyContent: "space-evenly", alignItems: "center", flexFlow: "row wrap", paddingTop:"50px", paddingBottom:"50px"}}>
<Image
  src={flo}
  alt="Flo"
  width={150}
  height={150}
  />

<div style={{display: "flex", flexDirection: "column", gap: "10px", padding: "10px"}}>
<h1 style={{color: "#17A7E4", fontSize: "30px", fontWeight: "600"}}>La productivité à votre portée</h1>

<div style={{paddingLeft: "15px", borderLeft: "2px solid #0AD8EB"}}>
<p style={{color:"white"}}>
Boostez votre productivité à la maison avec notre assistant intelligent ! 

</p>
<p style={{color:"white"}}>
Conçu par des étudiants pour des étudiants, 
</p>

</div>


</div>
<Image
  src={bot}
  alt="Bot"
  width={150}
  height={150}
  />
</section>

<Image
src={wave}
style={{width:"100%", marginTop:"-10px"}}
/>

<div className="title_container">
  <h2 className="title">
    Pourquoi Flo ?
  </h2>
</div>

<div className="container">
  <div className="child">
      <Image
  src={DevProd}
  alt="DevProd"
  width={200}
  />
  <div 
  </div>
</div>

   </div>
  )
}
