
import { View, Text, Image } from 'react-native';
const Header = () => {
    return(
        <View style={styles.header}>
        <Image source={require('../assets/image.png')} style={styles.logo} />
        <Text style={styles.title}>
          FlowBot
        </Text>
      </View>
    )

}
const styles = {
    header: {

        padding: 10,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 25,
        borderBottomWidth: 0.5,
        marginTop: 10
      },
      logo: {
        width: 75,
        height: 75,
        borderRadius: 100,
      
      
      },
      title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10
      },
      

}
export default Header;