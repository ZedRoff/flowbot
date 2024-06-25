"use client"
import logo from "./icon_header.png"
import flo from "./flo.png"
import SvgBurger from "./burger-menu-svgrepo-com.svg"
import Image from 'next/image'
import bot from "./bot.png"
import wave from "./wave.png"
import DevProd from "./dev_prod.png"
import FirstCard from "./FirstCard"
import Help from "./help.png"
import Custom from "./custom.png"
import App from "./app.png"
import Gui from "./gui.png"
import SecondCard from "./SecondCard"
import Spatial from "./spatial.png"
import Nino from "./nino.png"
import Linkedin from "./linkedin.png"
import ThirdCard from "./ThirdCard"
import Aman from "./aman.png"
import devBg from "./dev_bg.png"
import Arrow from "./arrow.png"
import Ia from "./Ia.png"
import FourthCard from "./FourthCard"
import Fusee from "./fusee.png"
import Calendar from "./calendar.png"
import Up from "./up.png"
import Switch from "./switch.png"
import Pushpin from "./pushpin.png"
import Discord from "./discord.png"
import Features from "./features.png"
import GoUp from "./go_up.png"
import leetchi from "./leetchi.png"
import DiscordLogo from "./discordlogo.png"
import checktick from "./righttick.png"
import discordcircle from "./discordcircle.png"
import githubcircle from "./githubcircle.png"
import mailcircle from "./mailcircle.png"
import { useState } from "react"





export default function Home() {
const [show, setShow] = useState(false)
  const handleClick = () => {
  setShow(!show)
  }



  const refTextArea = React.createRef()
  return (
   <div id="accueil">
<header style={{background: "#152A4D",border: "1.5px solid rgba(0,0,0,0.5)", paddingLeft: "15px", paddingRight:"15px", paddingTop: "25px", paddingBottom: "25px", display:"flex",alignItems:"center",justifyContent:"space-between", flexDirection: "row", boxShadow: "0px 24px 48px 0 rgba(0,0,0,0.16)", zIndex:999, position:"sticky", top: 0}}>
 
 <div style={{display: "flex", gap: "10px", alignItems: "center", justifyContent: "center"}}>


 <Image
  src={logo}
  alt="Logo"
  width={25}
  height={25}
  />
  <h1 style={{color: "white", fontSize: "20px", fontWeight: "600"}}>FloBot</h1>
   </div>
   <div onClick={handleClick} style={{cursor: "pointer"}}>
<SvgBurger />
</div>

<div style={{background: "#152A4D", width: "400px", borderTop:"none", display: show ? "flex" : "none", flexDirection: "column", gap: "15px", padding:"15px", position: "absolute", top: "89px", right: 0}}>


<a href="#accueil" style={{padding: "15px", background: "white", padding: "15px", width: "80%", margin: "0 auto", borderRadius: "15px", boxShadow: "0px 24px 48px 0 rgba(0,0,0,0.16)"}} className="spec_header" onClick={() => setShow(!show)}>
Accueil
</a>
<a href="#pourquoiflo" style={{padding: "15px", background: "white", padding: "15px", width: "80%", margin: "0 auto", borderRadius: "15px", boxShadow: "0px 24px 48px 0 rgba(0,0,0,0.16)"}} className="spec_header" onClick={() => setShow(!show)}>
Pourquoi Flo ? 
</a>
<a href="#solutionsdeveloppees"  style={{padding: "15px", background: "white", padding: "15px", width: "80%", margin: "0 auto", borderRadius: "15px", boxShadow: "0px 24px 48px 0 rgba(0,0,0,0.16)"}} className="spec_header" onClick={() => setShow(!show)}>
Les solutions développées
</a>
<a href="#lesfonctionnalites" style={{padding: "15px", background: "white", padding: "15px", width: "80%", margin: "0 auto", borderRadius: "15px", boxShadow: "0px 24px 48px 0 rgba(0,0,0,0.16)"}} className="spec_header" onClick={() => setShow(!show)}>
Les fonctionnalités
</a>
<a href="#quisommesnous"  style={{padding: "15px", background: "white", padding: "15px", width: "80%", margin: "0 auto", borderRadius: "15px", boxShadow: "0px 24px 48px 0 rgba(0,0,0,0.16)"}} className="spec_header" onClick={() => setShow(!show)}>
Qui sommes-nous ? 
</a>
<a href="#pourquoiinvestir"  style={{padding: "15px", background: "white", padding: "15px", width: "80%", margin: "0 auto", borderRadius: "15px", boxShadow: "0px 24px 48px 0 rgba(0,0,0,0.16)"}} className="spec_header" onClick={() => setShow(!show)}>
Pourquoi investir dans FloBot ?
</a>
<a href="#contact"  style={{padding: "15px", background: "white", padding: "15px", width: "80%", margin: "0 auto", borderRadius: "15px", boxShadow: "0px 24px 48px 0 rgba(0,0,0,0.16)"}} className="spec_header" onClick={() => setShow(!show)}>
Contact
</a>
<a href="#newsletter"  style={{padding: "15px", background: "white", padding: "15px", width: "80%", margin: "0 auto", borderRadius: "15px", boxShadow: "0px 24px 48px 0 rgba(0,0,0,0.16)"}} className="spec_header" onClick={() => setShow(!show)}>
NewsLetter
</a>
</div>
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
alt="Wave"
/>

<div id="pourquoiflo" style={{paddingBottom:"50px"}}></div>
<div className="title_container">
  <h2 className="title">
 Pourquoi Flo ?
  </h2>
</div>

<div className="container">
  <FirstCard image={DevProd} title="Une solution aux smartphones" description="Les smartphones occupent une place prépondérante dans nos vies, mais ne devraient pas influencer notre efficacité au travail. L'un des défis majeurs est de maximiser la productivité, c'est-à-dire le rendement en temps et en résultats. Les notifications, les appels et les actualités nous distraient souvent. Nous avons besoin d'une solution pour nous affranchir des téléphones, tout en conservant leurs atouts, nous avons besoin de FloBot !"/>
  <FirstCard image={Help} title="Un compagnon" description="FloBot, c'est plus qu'un simple assistant, il devient votre compagnon de travail, vous offrant une vaste panoplie d'outils pour vous faciliter la vie et vous faire gagner du temps."/>
  <FirstCard image={Custom} title="Entièrement customisable" description="Nous avons fait en sorte que chaque aspect de Flo soit customisable, et ergonomique a utilisé. En optant pour des designs sobres, droit au but, sans publicités ou distraction"/>

</div>
<div style={{width:"100px", background: "#152A4D", height: "5px", margin: "auto", marginTop: "50px", borderRadius:"50px"}}></div>
<div id="solutionsdeveloppees" style={{paddingBottom:"50px"}}></div>

<div className="title_container">
  <h2 className="title">
 Les solutions devéloppées
  </h2>
</div>


<div style={{display: "flex",  justifyContent: "center", marginTop:"50px", gap:"200px", flexFlow: "row wrap"}}>


    <div style={{display: "flex", flexDirection: "column", gap: "50px", width: "500px", alignItems: "center"}}>

    <h2 style={{color: "#152A4D"}}>Une application</h2>

    <p>
    Pour configurer le robot, vous utiliserez votre téléphone, mais ne vous inquiétez pas : une fois vos fichiers téléchargés et vos fiches créées, vous pourrez vous affranchir de votre téléphone.
    </p>

    <Image
    src={App}
    alt="App"
    width={300}
    
    />

    </div>




    <div style={{display: "flex", flexDirection: "column", gap: "50px", width: "500px", alignItems: "center"}}>



    <div style={{display: "flex", flexDirection: "column", gap: "50px", flex: 1, alignItems: "center"}}>
    <h2 style={{color: "#152A4D"}}>Un robot</h2>
    <p>
    Un robot équipé de reconnaissance vocale, d'une interface graphique, d'une molette, de LEDs et d'un bouton, enrichi par des effets sonores.
    </p>
    <Image
    src={Gui}
    alt="Robot"
    width={500}
    />

</div>



<div style={{display: "flex", flexDirection: "column", gap: "25px", flex: 1, alignItems:"center"}}>

<h2 style={{color: "#152A4D"}}>Des commandes vocales</h2>
<p>
A l'occasion de la journée des projets, les commandes vocales n'ont pas été mises en lumière, mais elles sont présentes dans le bot, une fois qu'il est paramétré, vous pouvez interagir avec lui par voie vocale.
</p>



    </div>

    </div>

    </div>


<div style={{width:"100px", background: "#152A4D", height: "5px", margin: "auto", marginTop: "50px", borderRadius:"50px"}}></div>

<div id="lesfonctionnalites" style={{paddingBottom:"50px"}}></div>
<div className="title_container">
  <h2 className="title">
 Les fonctionnalités
  </h2>
  <p>
  Dans cette section, nous vous recensons les modules majeurs de Flo, il y en a d'autres que nous vous invitons a découvrir sur notre stand.
  </p>
</div>

<div style={{display: "flex", alignItems:"center", justifyContent: "center", gap: "50px", marginTop:"50px", flexDirection: "column", width: "50%", margin: "0 auto"}}>
  <SecondCard title="Gestionnaire de tâches" description="Vous faites un travail de groupe, vous avez besoin d'être organiser, nous avons la solution ! Un TaskManager ! Grâce a cet outil, gardez le fil sur l'avancée de votre travail en organisant vos tâches par catégories, avec la possibilité de changer l'état des tâches au fil de l'avancement." />
  <SecondCard title="Gestionnaire de fichiers" description="Un système Cloud est mit a votre disposition, avec une capacité de 16 Go. Déposez vos fichiers importants pour votre travail au sein du bot, pour pouvoir les lire directement sur le robot. Vous pouvez réaliser des actions comme résumé les PDF, faire le bot lire un PDF, une visionneuse de PDF est intégrée au bot, convertir vos fichiers favoris en PDF aussi." />
  <SecondCard title="Fiches de révisions" description="Assez d'avoir un tas de feuilles et de devoir réfléchir a la disposition de vos fiches ? Nous avons la solution pour vous et avons développé pour cette occasion un système de fiches personnalisées, avec lequel vous pouvez rédiger vos propres fiches et les visionnées sur le bot." />
  <SecondCard title="Outils d'organisations" description="Des outils complets de gestion du temps comme un emploi du temps, un système de rappels sont mit a votre disposition. Vous pouvez aussi gérer mieux votre temps en gardant l'oeil sur les temps de vos trains. Aussi un pense bête est mit a votre disposition pour y inscrire vos idées les plus folles" />

  <h2 style={{color: "#152A4D", alignSelf:"center", marginTop: "-15px"}}>Et bien plus encore ...</h2>
</div>

<div style={{width:"100px", background: "#152A4D", height: "5px", margin: "auto", marginTop: "50px", borderRadius:"50px"}}></div>



<div id="quisommesnous" style={{paddingBottom:"50px"}}></div>

<div className="title_container">
  <h2 className="title">
 Qui sommes-nous ?
  </h2>
  
</div>

<div style={{display: "flex", justifyContent: "center",  gap: "100px", marginTop: "50px", flexFlow: "row wrap"}}>


<ThirdCard icon={Nino} link="https://www.linkedin.com/in/nino-coillard-32a9311b1/?originalSubdomain=fr" background={Spatial} co_name="Nino" role="Concepteur éléctronique" description="Passionné des nouvelles technologies et de l'électronique en général, mon rôle dans la conception de ce projet est le hardware en général comme les modèles, l'électronique etc..." />
<ThirdCard icon={Aman} link="https://www.linkedin.com/in/aman-ghazanfar/?originalSubdomain=fr" background={devBg} co_name="Aman" role="Développeur full-stack" description="Passionné par le développement informatique, mon rôle dans la conception de ce projet est le développement des solutions graphiques du robot." />


</div>

<div style={{width:"100px", background: "#152A4D", height: "5px", margin: "auto", marginTop: "50px", borderRadius:"50px"}}></div>
<div id="pourquoiinvestir" style={{paddingBottom:"50px"}}></div>
<div className="title_container">
  <h2 className="title">
Pourquoi investir dans FloBot ? 
  </h2>
  
</div>


<div style={{display: "flex", flexDirection: "column", gap: "50px", width: "80%", margin: "0 auto"}}>


<div style={{display: "flex", gap: "10px", alignItems: "center", marginLeft: "70px"}}>
<Image
src={Arrow}
width={50}
alt="Arrow"
/>

<h2 style={{color: "#152A4D"}}>Flo c'est,</h2>
</div>

<div style={{display: "flex", gap: "25px", flexDirection: "column",alignItems: "center"}}>
<FourthCard icon={Ia} description="Un bot qui aura très prochainement sa propre IA intégrée" />
<FourthCard icon={Fusee} description="Une vocation a en faire une start-up" />
<FourthCard icon={Calendar} description="Un projet inscrit au coaching entrepreunariat d'ESIEE Paris" />


</div>


<div style={{display: "flex", gap: "10px", alignItems: "center", marginLeft: "70px"}}>
<Image
src={Arrow}
width={50}
alt="Arrow"
/>

<h2 style={{color: "#152A4D"}}>Votre investissement nous permettra de,</h2>
</div>


<div style={{display: "flex", gap: "25px", flexDirection: "column",alignItems: "center"}}>
<FourthCard icon={Up} description="Acheter un équipement de pointe pour le développement d'un robot plus ergonomique, esthétique et puissant" />
<FourthCard icon={Switch} description="Héberger ce site web et l'application mobile" />
<FourthCard icon={Pushpin} description="Diminuer le prix de vente et accélérer la production de robots" />

</div>


<div style={{display: "flex", gap: "10px", alignItems: "center", marginLeft: "70px"}}>
<Image
src={Arrow}
width={50}
alt="Arrow"
/>

<h2 style={{color: "#152A4D"}}>Vous avez les avantages suivants,</h2>
</div>

<div style={{display: "flex", gap: "25px", flexDirection: "column",alignItems: "center"}}>
<FourthCard icon={Discord} description="Un rôle personnalisé sur le serveur Discord" />
<FourthCard icon={Features} description="Un accès anticipé aux nouvelles fonctionnalités du bot" />
<FourthCard icon={GoUp} description="Votre nom dans la liste des contributeurs dans le robot" />
</div>


<div style={{display: "flex", gap: "10px", alignItems: "center", marginLeft: "70px"}}>
<Image
src={Arrow}
width={50}
alt="Arrow"
/>

<h2 style={{color: "#152A4D"}}>Convaincu ? Cliquez ici pour nous soutenir : </h2>
<a href="https://www.leetchi.com/fr/c/flobot-1304220?utm_source=copylink&utm_medium=social_sharing" target="_blank">
<Image
src={leetchi}
width={150}
height={50}
style={{borderRadius:"5px", marginLeft: "50px"}}
alt="Leetchi"
/>
</a>

</div>

<div style={{background: "#FF7171", borderRadius:"5px", padding: "15px", color: "white", margin: "0 auto"}}>
  <p>Nous remercions chalheureusement toute personne qui soutient financièrement le projet, cela nous aide énormement a développé ce projet qui nous tient a coeur, merci beaucoup !</p>
</div>

</div>



<div style={{width:"100px", background: "#152A4D", height: "5px", margin: "auto", marginTop: "50px", borderRadius:"50px"}}></div>

<div id="contact" style={{paddingBottom:"50px"}}></div>
<div className="title_container" style={{width: "70%", margin: "0 auto", marginTop: "50px"}}>
  <h2 className="title">
Contact
  </h2>
  <p>
  Cette rencontre a la journée des projets vous a plû ? Vous avez une idée d'implémentations futures ? Voici un formulaire que vous pouvez remplir que nous sera d'une grande aide, merci pour l'attention que vous portez au projet !
  </p>
  

<div style={{width: "90%", margin: "0 auto"}}>



<h2 style={{color: "#152A4D", borderBottom: "2px solid #152A4D", marginLeft: "auto", float: "right", marginTop: "15px"}}>
<a href="mailto:flo-bot.pro@gmail.com" style={{textDecoration: "none", color: "inherit"}}>Notre adresse mail : flo-bot.pro@gmail.com</a>
</h2>
</div>








</div>








<div style={{width:"100px", background: "#152A4D", height: "5px", margin: "auto", marginTop: "50px", borderRadius:"50px"}}></div>
<div id="newsletter" style={{paddingBottom:"50px"}}></div>
<div className="title_container">
  <h2 className="title">
Newsletter
  </h2>
  
</div>

<div style={{ display: "flex", flexFlow: "row wrap", justifyContent: "space-evenly", alignItems: "center", gap: "100px", padding: "25px"}}>

    <div style={{display: "flex", flexDirection: "column", gap: "25px", alignItems: "center", width:"500px"}}>
      <p style={{color: "black"}}>
        Vous voulez rester notifier des avancées du bot ? Rejoignez le serveur Discord de la communauté !
      </p>
      <a href="https://discord.gg/BYPZGenrNG" target="_blank">
      <Image
      src={DiscordLogo}
      width={150}
      alt="Discord Logo"
      />
      </a>

    </div>


   
 

</div>




<footer style={{display: "flex", flexDirection: "column", gap: "25px", background:"#152A4D", paddingLeft: "150px", paddingRight: "150px", paddingTop: "25px", paddingBottom: "25px", marginTop: "100px"}}>
<div style={{display: "flex", gap: "25px",alignItems: "center", justifyContent: "space-between"}}>

<div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
  <h2 style={{color: "white"}}>FloBot</h2>
  <p style={{color: "white"}}>
    La productivité à votre portée
    </p>
</div>

<div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
  <h2 style={{color: "white"}}>Liens</h2>
  <div style={{display: "flex", gap: "10px", alignItems: "center", justifyContent: "center"}}>
  <a href="https://github.com/ZedRoff/flowbot" target="_blank">
    <Image
    src={githubcircle}
    width={50}
    style={{borderRadius:"50%"}}
    alt="Github"
    />
    </a>
    <a href="mailto:flo-bot.pro@gmail.com">
    <Image
    src={mailcircle}
    width={50}
    style={{borderRadius:"50%"}}
    alt="Mail"
    />
    </a>
    <a href="https://discord.gg/BYPZGenrNG" target="_blank">
    <Image
    src={discordcircle}
    width={50}
    style={{borderRadius:"50%"}}
    alt="Discord"
    />
    </a>

    </div>
</div>




</div>
<p style={{color: "white"}}>
  © FloBot 2024
</p>


</footer>
   </div>
   
  )
}
