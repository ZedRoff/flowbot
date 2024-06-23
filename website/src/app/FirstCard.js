import Image from 'next/image'

const FirstCard = (props) => {
    return(
        <div className="child">
      <Image
  src={props.image}
  alt="no image"
  width={250}
  />

<div style={{borderRadius:"15px", padding:"25px",maxWidth:"600px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", display: "flex", flexDirection: "column", gap:"15px", background:"white"}}>

<h2 style={{color: "#152A4D"}}>
 {props.title}
</h2>
<p style={{paddingLeft:"25px"}}>
{props.description}
</p>

</div>
  </div>
    )
}

export default FirstCard;