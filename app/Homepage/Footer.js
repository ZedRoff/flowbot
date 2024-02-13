import { View, Button, Pressable } from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMugSaucer } from '@fortawesome/free-solid-svg-icons/faMugSaucer'
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faStore } from '@fortawesome/free-solid-svg-icons'; 
import { faCog } from '@fortawesome/free-solid-svg-icons'; 
import { PageContext } from '../App.js';
import React, { useContext, useEffect } from 'react';
const Footer = ({active}) => { 
        let {currentPage, setCurrentPage} = useContext(PageContext)
        const handlePageChange = (page) => { 
                console.log(page)
                
                setCurrentPage(page);
              };

            
        return(
        
      <View style={styles.footer}>
   

      <View onPress={() => handlePageChange("home")}>
      <Pressable onPress={() => handlePageChange("home")}>
            <FontAwesomeIcon icon={ faHome } size={ 30 } color={active == "home" ? "blue":"black"}/>
            </Pressable>
      </View>
      
      <View style={styles.iconFooter}>
      <Pressable onPress={() => handlePageChange("apps")}>
              <FontAwesomeIcon icon={ faStore } size={ 30 } color={active == "apps" ? "blue":"black"} />
              </Pressable>
      </View>
      <View style={styles.iconFooter}>
      <Pressable onPress={() => handlePageChange("settings")}>
              <FontAwesomeIcon icon={ faCog } size={ 30 } color={active == "settings" ? "blue":"black"} />
              </Pressable>
      </View>
      <View style={styles.iconFooter}>
      
      <Pressable onPress={() => handlePageChange("infos")}>
              <FontAwesomeIcon icon={ faMugSaucer } size={ 30 } color={active == "infos" ? "blue":"black"} />
              </Pressable>
      </View>
      
      
      
            </View>
    )
}
const styles = {
    footer: {

        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
       
        alignItems: 'center',
        borderTopWidth: 0.5
        
      },
    
    
}
export default Footer;