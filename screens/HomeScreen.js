import React from 'react';
import { Image, Pressable, Text, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';   // import of the module "material top tabs"
import ReadingList from '../components/fiction/ReadingList';
import PillButton from '../components/ui/PillButton';
import Header from '../components/Header';

/* 
Fonction TopPills qui permet de customiser la barre incluant les 3 toptabs

state, descriptors et navigation sont les 3 props à mettre obligatoirement dans une barre d'onglets customisée (custom tabBar).
Ces trois props sont fournies automatiquement par React Navigation. 
*/

function TopPills({ state, descriptors, navigation }) {

  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingBottom: 8,
        justifyContent:'space-between'
      }}>    

      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const { options } = descriptors[route.key];
        const label = options.title ?? route.name;

        return (
          <PillButton
            key={route.key}
            label={label}
            active={focused}
            onPress={() => navigation.navigate(route.name)}
          />
          
        );
      })}     
    </View>
  );
}

/*
flexDirection: 'row',  ==>  on place les 3 buttons côte à côte
gap: 8,  ==> espace entre les boutons

{state.routes.map((route, index) => {       ==> On parcourt les 3 routes déclarées dans le Tab.Navigator, via le map. Pour chaque route, on crée dans le return un PillButton.
const focused = state.index === index;      ==> chaque route a un index. Lorsque le map aura un index égale à celui de la route, elle saura que cet onglet est l'onglet actif.
const { options } = descriptors[route.key]; ==> chaque route a un descriptior qui permet de récupérer les infos dans options. Ex plus bas : options={{ title: 'En cours' }} 
const label = options.title ?? route.name;  ==> On met le title qui était dans options (ex : "En cours"), sinon le nom de la route. Ex : name="Reading" 

<PillButton
  key={route.key}     ==> key pour dérouler le map
  label={label}       ==> texte du button : son title
  active={focused}    ==> si l'index de la route est égal à l'index du map alors focused = true, sinon focused = false. Et dans notre composant PillButton, si active = true alors c'est violet.
  onPress={() => navigation.navigate(route.name)}     ==> en appuyant dessus, ça nous amène sur la route Reading par exemple. Puis la route Reading fait appel au composant enfant "ReadingList". Ce composant enfant va passer en prop "reading" qui va fetch les fictions ayant ce status "reading".
/>


On a fait state.routes.map au lieu de faire directement routes.map car routes.map n'est pas accessible directement.
Il faut d'abord aller dans state puis dans route. State est comme ça :
{
  index: 0, // index de l’onglet actif
  key: 'TopTabs-xxxx',
  routeNames: ['Reading', 'ToRead', 'Finished'],
  routes: [ ... ] ===> tableau de toutes les routes
  
  Et routes n'est pas routes: ['Reading', 'ToRead', 'Finished']
  routes contient un tableau d'objets. Chaque route dedans est un objet contenant des infos comme key, name etc.
  Ex : 
  routes : [
    { key: 'Reading-123', name: 'Reading' },
    { key: 'ToRead-456', name: 'ToRead' },
    etc
    ]
*/

const Tab = createMaterialTopTabNavigator();   // import of the module "material top tabs"

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <Header onProfilePress={() => navigation.navigate('Profile')} />

      {/* Navigation of the 3 top Tabs : "En cours", "à lire", "terminées" in HomeScreen */}
      <View style={styles.tabs}>
        <Tab.Navigator
          initialRouteName="Reading" // tab "En cours" by default

          screenOptions={{          // screenOptions définit les options par défaut pour tous les onglets.
            swipeEnabled: true,     // Permet le swipe
            lazy: true,             //  seul l'onglet visible cad En cours est monté. Les autres onglets sont créés uniquement quand on les appelle
            tabBarIndicatorStyle: { height: 0 },   // Par défaut, il y a un trait bleu sous l'onglet actif. height: 0 permet de le disparaître
            tabBarStyle: { backgroundColor: 'transparent', elevation: 0 },    // La barre des 3 tabs reste transparente grâce à background transparent. elevation:0 supprime l'ombre qui apparaît par défaut
          }}

          tabBar={(props) => <TopPills {...props} />} // La barre qui inclut les 3 onglets. On la customise avec TopPills en haut.
        >
          <Tab.Screen
            name="Reading"
            options={{ title: 'En cours' }}
            children={() => <ReadingList readingStatus="reading" />}
          />
          {/* Ce Tab.Screen                ==>  Tab "En cours" ou d'un point de vue technique "ma route Reading"
          name="Reading"                   ==>  Nom de la route pour la navigation
          options={{ title: 'En cours' }}  ==>  Titre affiché pour l'utilisateur
          children={() => <ReadingList readingStatus="reading" />}  ==>  Le composant ReadingList a readingStatus comme prop. Ici, on dit readingStatus ="reading"
          */}

          <Tab.Screen
            name="ToRead"
            options={{ title: 'À lire' }}
            children={() => <ReadingList readingStatus="to-read" />}
          />
          {/*  Ce Tab.Screen ==> tab "À lire" ou route "ToRead"  */}

          <Tab.Screen 
            name="Finished"
            options={{ title: 'Terminées' }}
            children={() => <ReadingList readingStatus="finished" />}
          />
        </Tab.Navigator>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  avatar: { width: 40, height: 40, borderRadius: 50, backgroundColor: '#FFF' },

  tabs: { flex: 1, paddingTop: 20 },
});