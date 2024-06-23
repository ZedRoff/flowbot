
import Image from 'next/image'

const FourthCard = ({icon, description}) => {
    return(
        
<div style={{border: "2px solid #152A4D", borderRadius: "15px", paddingLeft:"25px", paddingRight: "25px", paddingTop: "15px", paddingBottom: "15px", display: "flex", gap: "25px", alignItems: "center", justifyContent: "space-between", width: "70%"}}>
<Image
src={icon}
width={50}
alt="no image"
/>
<h3 style={{color: "#152A4D"}}>{description}</h3>

</div>

    )
}

    export default FourthCard;