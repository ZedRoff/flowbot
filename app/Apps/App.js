import { View, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
const AppPayload = ({icon, title}) => {
    return(
        <View style={styles.app}>
        <FontAwesomeIcon icon={icon} size={50} color="black" />
        <Text style={styles.description}>{title}</Text>
      </View>
    )
}
const styles = {
    
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  },
 
  app: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    background: '#f6f6f6',
    padding: 10,
    borderRadius: 5,
  },
  description: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  
}
export default AppPayload;