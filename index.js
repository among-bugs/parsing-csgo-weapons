const fs = require('fs');
const got = require('got');
const jsdom = require("jsdom");
const {
    JSDOM
} = jsdom;
const {
    MongoClient
} = require('mongodb')
const client =
    new MongoClient('mongodb+srv://dust:9daWeTWtkFbvs3z3@cluster0.jv6jd.mongodb.net/yahoo?retryWrites=true&w=majority')

const urlData = [
    'https://counterstrike.fandom.com/wiki/AK-47', 
    'https://counterstrike.fandom.com/wiki/Maverick_M4A1_Carbine'
]

function getWeapon(currentWeaponURL) {
    got(currentWeaponURL).then(response => {
        const dom = new JSDOM(response.body);
        const aside = dom.window.document.
        querySelector('.portable-infobox.pi-background.pi-border-color.pi-theme-wikia.pi-layout-default')
        let data = aside.querySelectorAll('.pi-item.pi-data.pi-item-spacing.pi-border-color')
        let attributes = []

        data.forEach((item, i) => {
            attributes.push([
                item.querySelector('h3').textContent,
                item.querySelector('div').textContent
            ])
        })

        let weapon = new Object()
        attributes.forEach((attribute) => {
            weapon[`${attribute[0]}`] = attribute[1]
        })

        const start = async() => {
            try {
                await client.connect()
                console.log('db connect successful')
                const weapons = client.db().collection('weapons')
                await weapons.insertOne({
                    'alternate': weapon['Alternate name'],
                    'price': weapon['Price'],
                    'used by': weapon['Used by'],
                    'damage': weapon['Damage'],
                    'armor penetration': weapon['Armor penetration'],
                    'rate of fire': weapon['Rate of fire'],
                    'accurate range': weapon['Accurate range (meters)'],
                    'reload time': weapon['Reload time'],
                    'magazine capacity': weapon['Magazine capacity'],
                    'reserve ammo': weapon['Reserve ammo limit'],
                    'kill award': weapon['Kill award'],
                    'penetration power': weapon['Penetration power'],
                    'firing mode': weapon['Firing mode'],
                    'magazine cost': weapon['Magzine cost'],
                    'counterpart': weapon['Counterpart'],
                    'entity': weapon['Entity']
                })
            } catch(e) {
                console.log(e)
            }
        }
        start()
    }).catch(err => {
        console.log(err);
    });
}

urlData.forEach((urlItem) => {
    getWeapon(urlItem)
})