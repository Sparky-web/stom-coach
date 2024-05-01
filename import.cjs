const fs = require('fs');
const xml2js = require('xml2js');
const moment = require('moment');
const axios = require('axios')
const FormData = require('form-data');


const path = require('path');
// Read XML file
const fileContents = fs.readFileSync('store-6008296-aktual_nie-202404221303.yml', 'utf8');

// Convert XML to JSON
const monthMap = {
    'января': 'January',
    'февраля': 'February',
    'марта': 'March',
    'апреля': 'April',
    'мая': 'May',
    'июня': 'June',
    'июля': 'July',
    'августа': 'August',
    'сентября': 'September',
    'октября': 'October',
    'ноября': 'November',
    'декабря': 'December'
};

async function downloadImageAndAddToFormData(form, url, fieldName) {
    const imagePath = path.resolve(__dirname, 'image.jpg');

    // Download the image
    const response = await axios({
        url: url,
        method: 'GET',
        responseType: 'stream'
    });

    const writer = fs.createWriteStream(imagePath);

    response.data.pipe(writer);

    return await (new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    }).then(() => {
        // Create form data
        const form = new FormData();
        form.append(`files.${fieldName}`, fs.createReadStream(imagePath));

        // Now you can use the form data, for example in an HTTP request
        // axios.post('https://example.com/upload', form, { headers: form.getHeaders() });
    }))
}

xml2js.parseString(fileContents, async (err, result) => {
    if (err) {
        console.error(err);
        return;
    }

    // Map JSON data to desired format
    const events = result.yml_catalog.shop[0].offers[0].offer.map(event => {
        const description = event.description[0];
        const hasPracticalCourse = description.toLowerCase().includes('практический');
        const dateMatch = description.match(/(\d{1,2}-\d{1,2})|(\d{1,2})\s.{1,9}\s\d{4} г./);
        let date = null;

        if (dateMatch) {
            let dateStr
            if (dateMatch[0].match(/-\s+\d{1,2}\s/)) dateStr = dateMatch[0].replace(/-\s+\d{1,2}\s/, "")
            else dateStr = dateMatch[0]
            for (let [rus, eng] of Object.entries(monthMap)) {
                dateStr = dateStr.replace(rus, eng);
            }

            date = moment(dateStr, 'D MMMM YYYY г.').format();
        }

        const speakersParam = event.param.find(param => param.$.name === 'Лекторы');
        const speakers = speakersParam ? speakersParam._.split(',').map(name => {
            const nameTrimmed = name.trim();
            const bioStartIndex = description.indexOf(nameTrimmed) + nameTrimmed.length;
            const bio = description.substring(bioStartIndex).trim();
            return {
                name: nameTrimmed,
                workplace: "Врач-стоматолог общей практики", // Placeholder value
                bio: bio,
                image: event.picture[0]
            };
        }) : [];

        return {
            description: description,
            price: parseFloat(event.price[0]),
            ticketsAmount: parseInt(event.count[0], 10),
            ticketsLeft: parseInt(event.count[0], 10),
            date: date,
            city: event.param.find(param => param.$.name === 'Город')._,
            name: event.name[0],
            options: [],
            tags: hasPracticalCourse ? [{ name: "Практический курс" }] : [],
            speakers: speakers,
            image: event.picture[0]
        };


    });

    // for (let event of events) {
    //     const eventJson = {
    //         description: event.description,
    //         price: event.price,
    //         ticketsAmount: event.ticketsAmount,
    //         ticketsLeft: event.ticketsLeft,
    //         date: event.date || "2022-01-01T00:00:00.000Z",
    //         city: event.city,
    //         name: event.name,
    //         options: event.options,
    //         tags: event.tags,
    //         speakers: []
    //     };

    //     for (let i = 0; i < event.speakers.length; i++) {
    //         const speaker = event.speakers[i];
    //         const { data: { data: list } } = await axios.get('http://localhost:1337/api/speakers')
    //         const found = list.find(s => s.name === speaker.name)

    //         if (found) {
    //             eventJson.speakers.push(found.id);
    //         } else {
    //             const speakerData = {
    //                 name: speaker.name,
    //                 workplace: speaker.workplace,
    //                 bio: speaker.bio
    //             };

    //             const { data } = await axios.post("http://localhost:1337/api/speakers", { data: speakerData });
    //             eventJson.speakers.push(data.data.id);
    //         }
    //     }


    //     const { data } = await axios.post('http://localhost:1337/api/events', { data: eventJson })
    //     console.log(data)
    // }

    // console.dir(events, { depth: null });

    const { data: { data: list } } = await axios.get('http://localhost:1337/api/events?populate=*')

    for (let event of list) {
        const found = events.find(e => e.name === event.attributes.name)
        // if (!found) {
        //     await axios.delete(`http://localhost:1337/api/events/${event.id}`)
        // }

        const form = new FormData()
        await downloadImageAndAddToFormData(form, found.image, 'image')

        console.log(form)

        await axios.put('http://localhost:1337/api/events/' + event.id, form, {
            headers: {
                ...form.getHeaders()
            }
        })
    }

});



