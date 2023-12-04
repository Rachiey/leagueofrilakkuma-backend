const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

async function getSpecificBootImage(bootName) {
    try {
      const itemData = await axios.get('https://ddragon.leagueoflegends.com/cdn/13.23.1/data/en_US/item.json');
      const items = itemData.data.data;
      
      for (const key in items) {
        if (items.hasOwnProperty(key)) {
          if (items[key].name === bootName) {
            return `https://ddragon.leagueoflegends.com/cdn/13.23.1/img/item/${items[key].image.full}`;
          }
        }
      }
    } catch (error) {
      console.error('Error fetching item data:', error);
      throw new Error('Error fetching item data');
    }
  }

// Function to get the champion details based on ID
async function getRandomChampionDetails() {
    try {
      const response = await axios.get('https://ddragon.leagueoflegends.com/cdn/13.23.1/data/en_US/champion.json');
      const championData = response.data.data;
      const championKeys = Object.keys(championData);
      const randomChampionKey = championKeys[Math.floor(Math.random() * championKeys.length)];
      const randomChampion = championData[randomChampionKey];
  
      return {
        name: randomChampion.name,
        imageUrl: `https://ddragon.leagueoflegends.com/cdn/13.23.1/img/champion/${randomChampion.image.full}`,
      };
    } catch (error) {
      console.error('Error getting random champion details:', error);
      throw new Error('Error getting random champion details');
    }
  }

  async function fetchChampionNames() {
    try {
      const response = await axios.get('https://ddragon.leagueoflegends.com/cdn/13.23.1/data/en_US/champion.json');
      const championData = response.data.data;
      const championNames = Object.values(championData).map(champion => ({
        name: champion.name,
      }));
  
      return championNames;
    } catch (error) {
      console.error('Error fetching champion names:', error);
      throw new Error('Error fetching champion names');
    }
  }
  
 

  const getRandomItemsForRandomChampion = async () => {
    try {
      const version = '13.23.1';
      const language = 'en_US';
  
      // Fetch item data
      const itemData = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/${language}/item.json`);
      const items = await itemData.json();
  
      // Filter core items (depth = 3)
      const coreItems = Object.values(items.data).filter((item) => item.depth === 3);
     
  
  
      // Filter mythic items that include 'Mythic Passive' and have a depth of 3
      const mythicItems = coreItems.filter((item) => item.tags && item.description.includes('Mythic Passive:'));
      

      const getLegendaryItems = (items) => {
        // Filter core items (depth = 3)
        const coreItems = Object.values(items.data).filter((item) => item.depth === 3);
      
        // Filter mythic items that include 'Mythic Passive' and have a depth of 3
        const mythicItems = coreItems.filter((item) => item.tags && item.description.includes('Mythic Passive:'));
      
        // Exclude mythic items to get legendary items
        const legendaryItems = coreItems.filter((item) => !mythicItems.includes(item));
    
        return legendaryItems;
      };

      const legendaryItems = getLegendaryItems(items);

      const removeUnwantedItems = (items) => {
        const unwantedNames = [
          "Atma's Reckoning",
          "Deathfire Grasp",
          "Ghostcrawlers",
          "Hextech Gunblade",
          "Innervating Locket",
          "Lifeline",
          "Spectral Cutlass",
          "Sword of the Divine",
          "The Golden Spatula",
          "Zephyr"
        ];
      
        const excludedItems = items.filter((item) => unwantedNames.includes(item.name));

      
        return items.filter((item) => !unwantedNames.includes(item.name));
      };
      
      // Using the function to filter unwanted items from legendaryItems
      const filteredLegendaryItems = removeUnwantedItems(legendaryItems);


      // Pick one mythic item
      const randomMythic = mythicItems[Math.floor(Math.random() * mythicItems.length)];
  
      // Pick 5 more random core items excluding the chosen mythic item
      const specificBoots = [
        "Berserker's Greaves",
        'Boots of Swiftness',
        'Ionian Boots of Lucidity',
        "Mercury's Treads",
        'Mobility Boots',
        'Plated Steelcaps',
        "Sorcerer's Shoes",
      ];
  
      const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };
      
      // Shuffling the legendaryItems array
      const shuffledLegendaryItems = shuffleArray(filteredLegendaryItems);
      
      const selectedItems = [];
  
      // Pick one random boot
      const specificBootName = specificBoots[Math.floor(Math.random() * specificBoots.length)];
      const specificBootImageUrl = await getSpecificBootImage(specificBootName);
  
      selectedItems.push({ name: specificBootName, image: specificBootImageUrl });
      selectedItems.push({ name: randomMythic.name, image: `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${randomMythic.image.full}` });
  
      // Assuming randomNonMythicItems is an array of objects with name and image properties
      for (let i = 0; i < 4; i++) {
        if (shuffledLegendaryItems[i]) {
          selectedItems.push({
            name: shuffledLegendaryItems[i].name,
            image: `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${shuffledLegendaryItems[i].image.full}`
          });
        }
      }
      
      // Return the final build array including boots, mythic item, and non-mythic random items
      return selectedItems;
    } catch (error) {
      console.error('Error fetching item data:', error);
      throw new Error('Error fetching item data');
    }
  };
  

  
  // Example usage
  getRandomItemsForRandomChampion().then((items) => {
    // Use the items for a champion build or display them to the user
  });

  app.get('/fetch-champion', async (req, res) => {
    try {
      const championNames = await fetchChampionNames();
      res.json(championNames);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch champion names' });
    }
  });
  
  
app.get('/random-build', async (req, res) => {
    try {
      const randomBuild = await getRandomItemsForRandomChampion();
      res.json(randomBuild);
    } catch (error) {
      console.error('Error generating random build:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

app.get('/random-champion-details', async (req, res) => {
  try {
    const randomChampionDetails = await getRandomChampionDetails();
    res.json(randomChampionDetails);
  } catch (error) {
    console.error('Error fetching random champion details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/random-summoner-spells', (req, res) => {
    try {
      const manualSummonerSpells = [
        'Heal',
        'Ghost',
        'Barrier',
        'Exhaust',
        'Mark',
        'Clarity',
        'Flash',
        'Cleanse',
        'Ignite'
        // Add more summoner spells as needed
      ];
  
      const getRandomIndex = (max) => Math.floor(Math.random() * max);
  
      const getSummonerSpellImage = (spellName) => {
        // Image URLs map
        const spellImageMap = {
          Heal: 'https://ddragon.leagueoflegends.com/cdn/13.23.1/img/spell/SummonerHeal.png',
          Ghost: 'https://ddragon.leagueoflegends.com/cdn/13.23.1/img/spell/SummonerHaste.png',
          Barrier: 'https://ddragon.leagueoflegends.com/cdn/13.23.1/img/spell/SummonerBarrier.png',
          Exhaust: 'https://ddragon.leagueoflegends.com/cdn/13.23.1/img/spell/SummonerExhaust.png',
          Mark: 'https://ddragon.leagueoflegends.com/cdn/13.23.1/img/spell/SummonerSnowball.png',
          Clarity: 'https://ddragon.leagueoflegends.com/cdn/13.23.1/img/spell/SummonerMana.png',
          Flash: 'https://ddragon.leagueoflegends.com/cdn/13.23.1/img/spell/SummonerFlash.png',
          Cleanse: 'https://ddragon.leagueoflegends.com/cdn/13.23.1/img/spell/SummonerBoost.png',
          Ignite: 'https://ddragon.leagueoflegends.com/cdn/13.23.1/img/spell/SummonerDot.png'
          // Add the rest of the summoner spell image URLs as needed
        };
  
        return spellImageMap[spellName] || 'https://placeholder-url.com/default-image.png'; // Replace with a default image URL
      };
  
      const getRandomSummonerSpells = () => {
        const randomIndices = [];
        while (randomIndices.length < 2) {
          const randomIndex = getRandomIndex(manualSummonerSpells.length);
          if (!randomIndices.includes(randomIndex)) {
            randomIndices.push(randomIndex);
          }
        }
  
        const selectedSummonerSpells = randomIndices.map(index => ({
          name: manualSummonerSpells[index],
          imageUrl: getSummonerSpellImage(manualSummonerSpells[index])
        }));
  
        return selectedSummonerSpells;
      };
  
      const twoDifferentRandomSummonerSpells = getRandomSummonerSpells();
      res.json(twoDifferentRandomSummonerSpells);
    } catch (error) {
      console.error('Error fetching summoner spells:', error);
      res.status(500).json({ error: 'Error fetching summoner spells' });
    }
  });
  
  
  
const PORT = process.env.PORT || 3000; // Define the port for the server

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});