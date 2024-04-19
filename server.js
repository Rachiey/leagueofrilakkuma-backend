const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

async function getSpecificBootImage(bootName) {
    try {
      const itemData = await axios.get('https://ddragon.leagueoflegends.com/cdn/14.8.1/data/en_US/item.json');
      const items = itemData.data.data;
      
      for (const key in items) {
        if (items.hasOwnProperty(key)) {
          if (items[key].name === bootName) {
            return `https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/${items[key].image.full}`;
          }
        }
      }
    } catch (error) {
      console.error('Error fetching item data:', error);
      throw new Error('Error fetching item data');
    }
}

async function getRandomChampionDetails() {
    try {
      const response = await axios.get('https://ddragon.leagueoflegends.com/cdn/14.8.1/data/en_US/champion.json');
      const championData = response.data.data;
      const championKeys = Object.keys(championData);
      const randomChampionKey = championKeys[Math.floor(Math.random() * championKeys.length)];
      const randomChampion = championData[randomChampionKey];
  
      return {
        name: randomChampion.name,
        imageUrl: `https://ddragon.leagueoflegends.com/cdn/14.8.1/img/champion/${randomChampion.image.full}`,
      };
    } catch (error) {
      console.error('Error getting random champion details:', error);
      throw new Error('Error getting random champion details');
    }
}

async function fetchChampionNames() {
    try {
      const response = await axios.get('https://ddragon.leagueoflegends.com/cdn/14.8.1/data/en_US/champion.json');
      const championData = response.data.data;
      const champions = Object.values(championData).map(champion => ({
        name: champion.name,
        image: `https://ddragon.leagueoflegends.com/cdn/14.8.1/img/champion/${champion.image.full}`, // Adjust the URL structure as needed
      }));
  
      return champions;
    } catch (error) {
      console.error('Error fetching champion data:', error);
      throw new Error('Error fetching champion data');
    }
}

const getRandomItemsForRandomChampion = async () => {
  try {
    const version = '14.8.1';
    const language = 'en_US';

    // Fetch item data
    const itemData = await axios.get(`https://ddragon.leagueoflegends.com/cdn/${version}/data/${language}/item.json`);
    const items = Object.values(itemData.data.data);

    // Filter core items (depth = 3)
    const coreItems = items.filter(item => item.depth === 3);

    // Remove unwanted items
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
      "Zephyr",
      "Guardian Angel",
      "Mejai's Soulstealer",
      "Hullbreaker",
      "Sword of Blossoming Dawn",
      "Frozen Mallet",
      "Lightning Braid",
      "Hellfire Hatchet",
      "Perplexity",
      "Vigilant Wardstone",
      "Worldless Promise"
    ];
    const filteredItems = coreItems.filter(item => !unwantedNames.includes(item.name));

    // Pick 5 random items
    const selectedItems = [];
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * filteredItems.length);
      selectedItems.push({
        name: filteredItems[randomIndex].name,
        image: `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${filteredItems[randomIndex].image.full}`
      });
    }

    // Pick one random boot
    const specificBoots = [
      "Berserker's Greaves",
      'Boots of Swiftness',
      'Ionian Boots of Lucidity',
      "Mercury's Treads",
      'Mobility Boots',
      'Plated Steelcaps',
      "Sorcerer's Shoes",
    ];
    const specificBootName = specificBoots[Math.floor(Math.random() * specificBoots.length)];
    const specificBootImageUrl = await getSpecificBootImage(specificBootName);
    selectedItems.splice(0, 0, { name: specificBootName, image: specificBootImageUrl });

    console.log('Selected Items:', selectedItems);

    return selectedItems;
  } catch (error) {
    console.error('Error fetching item data:', error);
    throw new Error('Error fetching item data');
  }
};

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
