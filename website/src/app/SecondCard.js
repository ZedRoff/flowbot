
const SecondCard = (props) => {
    return(
      <div style={{background: "#152A4D", padding:"50px", display: "flex", flexDirection: "column", gap:"25px", borderRadius:"15px", boxShadow: "0px 24px 48px 0 rgba(0,0,0,0.16)"}}>
        <h2 style={{color: "#17A7E4"}}>
         {props.title}
        </h2>
        <p style={{marginLeft:"75px", color: "white"}}>
        {props.description}
        </p>
        </div>
    )
}

export default SecondCard;