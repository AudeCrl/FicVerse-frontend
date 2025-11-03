import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import FandomCard from './FandomCard';
import { useSelector } from "react-redux";

const API_IP = process.env.EXPO_PUBLIC_API_URL;

const defaultSort = { sort: 'lastReadAt', order: 'desc'};

// readingStatus sera l'une des valeurs suivantes : ["reading","to-read","finished"]
export default function ReadingList({ readingStatus }) {
  const user = useSelector((state) => state.user.value);
  const [fandomsFetch, setFandomsFetch] = useState([]);
  const [globalSortState, setGlobalSortState] = useState(defaultSort);
  
  const fandomsData = [
    {
      "_id": "655a6a690e5f03d61b34a101",
      "userId": "6903a24eaa428a59e046adc6",
      "name": "Harry Potter",
      "position": 1,
      "createdAt": "2025-01-01T10:00:00.000Z",
      "fictions": [
        {
          "_id": "655c4c2a7f3d9d01d4a00001",
          "userId": "6903a24eaa428a59e046adc6",
          "fandomId": "655a6a690e5f03d61b34a101",
          "title": "Action in the Serpent's Heart",
          "link": "https://archiveofourown.org/works/13871511",
          "author": "Jane_Blossom",
          "summary": "Drago Malfoy doit naviguer dans les eaux troubles de l'après-guerre...",
          "numberOfWords": 150000,
          "numberOfChapters": 30,
          "lastChapterRead": 12,
          "readingStatus": "reading",
          "storyStatus": "in-progress",
          "rate": {
            "value": 4,
            "display": true
          },
          "image": "/covers/fict1.jpg",
          "lastReadAt": "2025-10-31T12:00:00.000Z",
          "createdAt": "2025-09-01T08:00:00.000Z",
          "tags": [
            {
              "_id": "655b3b1c6e1147012c8a0102",
              "userId": "6903a24eaa428a59e046adc6",
              "name": "Angst",
              "usageCount": 3,
              "color": 2
            },
            {
              "_id": "655b3b1c6e1147012c8a0103",
              "userId": "6903a24eaa428a59e046adc6",
              "name": "Univers Alternatif",
              "usageCount": 5,
              "color": 3
            },
            {
              "_id": "655b3b1c6e1147012c8a0106",
              "userId": "6903a24eaa428a59e046adc6",
              "name": "Post-Canon",
              "usageCount": 2,
              "color": 6
            }
          ],
          "lang": "Français",
          "personalNotes": "Très bon, mais c'est lourd à lire par moment."
        },
        {
          "_id": "655c4c2a7f3d9d01d4a00005",
          "userId": "6903a24eaa428a59e046adc6",
          "fandomId": "655a6a690e5f03d61b34a101",
          "title": "A Thousand Words",
          "author": "Trucumze",
          "summary": "Un sort raté ramène Severus Rogue à son corps d'adolescent. Il doit vivre son passé, sachant son futur.",
          "numberOfWords": 45000,
          "numberOfChapters": 10,
          "lastChapterRead": 7,
          "readingStatus": "reading",
          "storyStatus": "in-progress",
          "rate": {
            "value": 4,
            "display": false
          },
          "image": "/covers/fict5.jpg",
          "lastReadAt": "2025-10-27T14:00:00.000Z",
          "createdAt": "2025-09-20T08:00:00.000Z",
          "tags": [
            {
              "_id": "655b3b1c6e1147012c8a0101",
              "userId": "6903a24eaa428a59e046adc6",
              "name": "Romance",
              "usageCount": 4,
              "color": 1
            },
            {
              "_id": "655b3b1c6e1147012c8a0104",
              "userId": "6903a24eaa428a59e046adc6",
              "name": "Slow Burn",
              "usageCount": 2,
              "color": 4
            },
            {
              "_id": "655b3b1c6e1147012c8a0109",
              "userId": "6903a24eaa428a59e046adc6",
              "name": "Voyage Temporel",
              "usageCount": 1,
              "color": 9
            }
          ],
          "lang": "Anglais",
          "personalNotes": null
        }
      ]
    },
    {
      "_id": "655a6a690e5f03d61b34a102",
      "userId": "6903a24eaa428a59e046adc6",
      "name": "Orgueil et Préjugés",
      "position": 2,
      "createdAt": "2025-01-05T10:00:00.000Z",
      "fictions": [
        {
          "_id": "655c4c2a7f3d9d01d4a00002",
          "userId": "6903a24eaa428a59e046adc6",
          "fandomId": "655a6a690e5f03d61b34a102",
          "title": "Une lettre jamais envoyée",
          "author": "LumosShadow",
          "summary": "Dans une version alternative, Elizabeth découvre une lettre écrite par Darcy avant sa déclaration à Hunsford.",
          "numberOfWords": 27300,
          "numberOfChapters": 9,
          "lastChapterRead": 9,
          "readingStatus": "reading",
          "storyStatus": "completed",
          "rate": {
            "value": 5,
            "display": true
          },
          "image": "/covers/fict2.jpg",
          "lastReadAt": "2025-10-25T15:30:00.000Z",
          "createdAt": "2025-08-01T08:00:00.000Z",
          "tags": [
            {
              "_id": "655b3b1c6e1147012c8a0101",
              "userId": "6903a24eaa428a59e046adc6",
              "name": "Romance",
              "usageCount": 4,
              "color": 1
            },
            {
              "_id": "655b3b1c6e1147012c8a0103",
              "userId": "6903a24eaa428a59e046adc6",
              "name": "Univers Alternatif",
              "usageCount": 5,
              "color": 3
            },
            {
              "_id": "655b3b1c6e1147012c8a0107",
              "userId": "6903a24eaa428a59e046adc6",
              "name": "Drame",
              "usageCount": 3,
              "color": 7
            }
          ],
          "lang": "Français",
          "personalNotes": "Mon coup de cœur. Magnifique réécriture. À relire un jour !"
        }
      ]
    },
    {
      "_id": "655a6a690e5f03d61b34a104",
      "userId": "6903a24eaa428a59e046adc6",
      "name": "Naruto",
      "position": 4,
      "createdAt": "2025-01-15T10:00:00.000Z",
      "fictions": [
        {
          "_id": "655c4c2a7f3d9d01d4a00008",
          "userId": "6903a24eaa428a59e046adc6",
          "fandomId": "655a6a690e5f03d61b34a104",
          "title": "Le Chemin des Héroïnes",
          "author": "KyuubiFan",
          "summary": "Focus sur les personnages féminins, réinventant leur parcours.",
          "numberOfWords": 105000,
          "numberOfChapters": 25,
          "lastChapterRead": 22,
          "readingStatus": "reading",
          "storyStatus": "completed",
          "rate": {
            "value": 4,
            "display": true
          },
          "image": null,
          "lastReadAt": "2025-10-30T22:00:00.000Z",
          "createdAt": "2025-09-28T08:00:00.000Z",
          "tags": [
            {
              "_id": "655b3b1c6e1147012c8a0103",
              "userId": "6903a24eaa428a59e046adc6",
              "name": "Univers Alternatif",
              "usageCount": 5,
              "color": 3
            },
            {
              "_id": "655b3b1c6e1147012c8a0106",
              "userId": "6903a24eaa428a59e046adc6",
              "name": "Post-Canon",
              "usageCount": 2,
              "color": 6
            },
            {
              "_id": "655b3b1c6e1147012c8a0108",
              "userId": "6903a24eaa428a59e046adc6",
              "name": "Humor",
              "usageCount": 2,
              "color": 8
            }
          ],
          "lang": "Anglais",
          "personalNotes": null
        }
      ]
    }
  ];

  const handleGlobalSortChange = (newSortType, newSortOrder) => {
    setGlobalSortState({ sort: newSortType, order: newSortOrder});
  }

  useEffect(() => {
    const fetchFandoms = async () => {
      try {
        const url = `${API_IP}/fiction/${readingStatus}?srt=${globalSortState.sort}&order=${globalSortState.order}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(errorBody.error || `Erreur HTTP ${response.status} lors du fetch.`);
        }

        const data = await response.json();

        setFandomsFetch(data.fandoms);

      } catch (e) {
        console.error('Fetch Error:', e);        
      }
    };

    fetchFandoms();
  }, [readingStatus, globalSortState]);

  const fandoms = fandomsFetch.map((fandom, index) => <FandomCard key={index} fandomName={fandom.name} fictions={fandom.fictions} onGlobalSortChange={handleGlobalSortChange} currentGlobalSort={globalSortState}/>);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>{fandoms}</ScrollView>      
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 14,
    },
});
