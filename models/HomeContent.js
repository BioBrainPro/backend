const mongoose = require('mongoose');

const expertiseSchema = new mongoose.Schema({
  btn: {
    link: { type: String, default: '' },
    en: { type: String, default: 'Learn More' },
    ru: { type: String, default: '' },
    am: { type: String, default: '' }
  },
  text: {
    en: { type: String, default: '' },
    ru: { type: String, default: '' },
    am: { type: String, default: '' }
  },
  icon: { type: String, default: null }, // Media file URL or null
  title: {
    en: { type: String, default: '' },
    ru: { type: String, default: '' },
    am: { type: String, default: '' }
  }
});

const homeContentSchema = new mongoose.Schema({
  section1: {
    button: {
        en: { type: String, default: '' },
        ru: { type: String, default: '' },
        am: { type: String, default: '' },
        link: { type: String, default: '' }
    },
    img: { type: String, default: null }, // Media file URL or null
    video: { type: String, default: null }, // Media file URL or null
    title: {
      en: { type: String, default: 'Your BioBrain Pro Solution For Clinical Trial Success' },
      ru: { type: String, default: '' },
      am: { type: String, default: '' }
    },
    text: {
      en: { type: String, default: '' },
      ru: { type: String, default: '' },
      am: { type: String, default: '' }
    },
  },
  section3: {
    expertises: { type: [expertiseSchema], default: [] },
    title: {
      en: { type: String, default: '' },
      ru: { type: String, default: '' },
      am: { type: String, default: '' }
    }
  },
  section2: {
    text: {
      en: { type: String, default: '' },
      ru: { type: String, default: '' },
      am: { type: String, default: '' }
    },
    img: { type: String, default: null }, // Media file URL or null
    title: {
      en: { type: String, default: '' },
      ru: { type: String, default: '' },
      am: { type: String, default: '' }
    }
  },
  section4: {
    title: {
      en: { type: String, default: '' },
      ru: { type: String, default: '' },
      am: { type: String, default: '' }
    },
    btn: {
      link: { type: String, default: '' },
      en: { type: String, default: 'Learn More' },
      ru: { type: String, default: '' },
      am: { type: String, default: '' }
    },
    text: {
      en: { type: String, default: '' },
      ru: { type: String, default: '' },
      am: { type: String, default: '' }
    }
  },
  section5: {
    title: {
      en: { type: String, default: '' },
      ru: { type: String, default: '' },
      am: { type: String, default: '' }
    },
    img: { type: String, default: null }, // Media file URL or null
    text: {
      en: { type: String, default: '' },
      ru: { type: String, default: '' },
      am: { type: String, default: '' }
    }
  },
  connectBlock: {
    title: {
      en: { type: String, default: '' },
      ru: { type: String, default: '' },
      am: { type: String, default: '' }
    },
    btn: {
      en: { type: String, default: 'Contact BioBrain for a Free Consultation' },
      ru: { type: String, default: '' },
      am: { type: String, default: '' },
      link: { type: String, default: '' }
    },
    text: {
      en: { type: String, default: '' },
      ru: { type: String, default: '' },
      am: { type: String, default: '' }
    }
  },
});

const HomeContent = mongoose.model('HomeContent', homeContentSchema);

module.exports = HomeContent;
