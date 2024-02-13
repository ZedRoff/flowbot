import List from './List';
import { View, Text } from 'react-native';
const Homepage = () => {
    return(
        <>
       <View style={styles.content}>
        <Text style={styles.subTitle}>La productivité à votre portée</Text>
      </View>
   <List />
   </>
       
    )

}
const styles = {
    content: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginTop: 10
      },
      subTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black'
      }
}

    export default Homepage;