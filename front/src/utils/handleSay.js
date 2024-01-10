
import axios from 'axios';
  
    const handleSay = (textToSay) => {
        axios({
            method: 'post',
            url: '/api/talk',
            data: {
                textToSay
            }
        }).then((response) => {
          return; // TODO: handle response
        });
    

 

};

export default handleSay;
