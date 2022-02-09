const fs = require('fs');
const got = require('got');
const jsdom = require("jsdom");
const {
    JSDOM
} = jsdom;
const {
    MongoClient
} = require('mongodb');
const {
    all
} = require('p-cancelable');
const client =
    new MongoClient('mongodb+srv://dust:9daWeTWtkFbvs3z3@cluster0.jv6jd.mongodb.net/yahoo?retryWrites=true&w=majority')

const allData = {
    pistols: {
        urls: [
            'https://liquipedia.net/counterstrike/P2000',
            'https://liquipedia.net/counterstrike/USP-S',
            'https://liquipedia.net/counterstrike/Glock-18',
            'https://liquipedia.net/counterstrike/Dual_Berettas',
            'https://liquipedia.net/counterstrike/P250',
            'https://liquipedia.net/counterstrike/Five-SeveN',
            'https://liquipedia.net/counterstrike/Tec-9',
            'https://liquipedia.net/counterstrike/Desert_Eagle',
            'https://liquipedia.net/counterstrike/R8_Revolver'
        ]
    },
    knifes: {
        urls: [
            'https://liquipedia.net/counterstrike/Knife'
        ]
    }
}

function getWeapons(currentWeaponURL) {
    got(currentWeaponURL).then(response => {
        const dom = new JSDOM(response.body)
        let allAttributes = []
        dom.window.document.querySelectorAll('.infobox-cell-2.infobox-description').forEach((item) => {
            if (item.nextElementSibling.textContent != null) {
                allAttributes.push([
                    item.textContent,
                    item.nextElementSibling.textContent
                ])
            }
        })
        let weapon = new Object()
        allAttributes.forEach(attribute => {
            weapon[`${attribute[0]}`] = attribute[1]
        })
        console.log(weapon)
        const start = async () => {
            try {
                await client.connect()
                console.log(`db connect successful`)
                const weapons = client.db().collection('weapons')
                await weapons.insertOne({
                    'name': dom.window.document.
                    querySelector('.firstHeading span').textContent,
                    'class': weapon['Class:'],
                    'price': weapon['Price:'],
                    'kill_award': weapon['Kill award:'],
                    'capacity': weapon['Ammunition/Capacity:'],
                    'reload_time': weapon['Reload time:'],
                    'movement_speed': weapon['Movement Speed:'],
                    'firing_mode': weapon['Firing mode:'],
                    'side': weapon['Side:']
                })
            } catch (e) {
                console.log(e)
            }
        }
        start()
    }).catch(err => {
        console.log(err);
    });
}

allData.pistols.urls.forEach(currentURL => {
    getWeapons(currentURL, allData.pistols.objects)
})

allData.knifes.urls.forEach(currentURL => {
    getWeapons(currentURL)
})