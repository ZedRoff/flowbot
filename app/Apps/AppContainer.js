import { faClock } from '@fortawesome/free-solid-svg-icons';
import AppPayload from './App.js'
import { View } from 'react-native';
const AppContainer = () => {
    return(
        <View style={styles.appContainer}>
     <AppPayload icon={faClock} title="Chronomètre" />
     <AppPayload icon={faClock} title="Chronomètre" />
    </View>
    )
}
const styles = {
    appContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-evenly',
        gap: 15
      },
}
export default AppContainer;