function between( lower, higher ) {
  return lower + Math.random() * ( higher - lower ) ;
}

function from( array ) {
  array = ( arguments.length == 1 ) ? array : Array.prototype.slice.call( arguments ) ;
  return array[ Math.floor( Math.random() * array.length ) ] ;
}

function repeat( min, max, func ) {
  new Array( Math.floor( between( min, max + 1 ) ) ).fill().map( func ) ;
}

function Color( hue, saturation, luminance ) {
  var hsl = hue + ', ' + ( saturation * 100 ) + '%, ' + ( luminance * 100 ) + '%' ;
  Object.defineProperties( this, {
    hue: { value: hue },
    saturation: { value: saturation },
    luminance: { value: luminance },
    css: { value: 'hsl( ' + hsl + ' )' },
    withAlpha: { value: function( alpha ) {
      return 'hsla( ' + hsl + ', ' + alpha + ' )' ; 
    }}
  });
}

function analogousPalette( main, spread ) {
  return [
    new Color( main, between( 0.8, 0.9 ), between( 0.4, 0.5 ) ),
    new Color( main - spread / 2, between( 0.7, 0.9 ), between( 0.4, 0.6 ) ),
    new Color( main - spread, between( 0.8, 1 ), between( 0.5, 0.6 ) ),
    new Color( main + spread / 2, between( 0.7, 0.9 ), between( 0.4, 0.6 ) ),
    new Color( main + spread, between( 0.8, 1 ), between( 0.5, 0.6 ) )
  ];
}

function monochromaticPalette( main ) {
  return [
    new Color( main, between( 0.7, 0.9 ), between( 0.4, 0.5 ) ),
    new Color( main, between( 0.6, 0.8 ), between( 0.6, 0.8 ) ),
    new Color( main, between( 0.8, 1.0 ), between( 0.2, 0.5 ) ),
    new Color( main, between( 0.3, 0.5 ), between( 0.3, 0.6 ) ),
    new Color( main, between( 0.5, 0.8 ), between( 0.4, 0.6 ) )
  ];
}

function triadPalette( main ) {
  return [
    new Color( main, between( 0.7, 0.9 ), between( 0.4, 0.5 ) ),
    new Color( ( main + 120 ) % 360, between( 0.6, 0.8 ), between( 0.4, 0.6 ) ),
    new Color( ( main - 120 ) % 360, between( 0.6, 0.8 ), between( 0.4, 0.6 ) ),
    new Color( main, between( 0.3, 0.6 ), between( 0.3, 0.5 ) ),
    new Color( main, between( 0.5, 0.8 ), between( 0.6, 0.8 ) )
  ];
}

function complementaryPalette( main ) {
  return [
    new Color( main, between( 0.7, 0.9 ), between( 0.4, 0.5 ) ),
    new Color( main, between( 0.8, 1.0 ), between( 0.3, 0.5 ) ),
    new Color( main, between( 0.4, 0.7 ), between( 0.6, 0.8 ) ),
    new Color( ( main + 180 ) % 360, between( 0.7, 0.9 ), between( 0.4, 0.5 ) ),
    new Color( ( main + 180 ) % 360, between( 0.5, 0.8 ), between( 0.4, 0.6 ) )
  ];
}

function getColorPalette() {
  return from( analogousPalette, monochromaticPalette, triadPalette, complementaryPalette )( between( 0, 360 ), between( 40, 80 ) ) ;
}

function getGrayscalePalette() {
  return [
    new Color( between( 0, 360 ), between( 0, 0.1 ), between( 0.9, 1 ) )
  ].concat( Math.random() > 0.7 ? [] : [
    new Color( between( 0, 360 ), between( 0, 0.1 ), between( 0, 0.2 ) )
  ]).concat( new Array( Math.floor( between( 0, 3 ) ) ).fill().map( function() {
    return new Color( between( 0, 360 ), between( 0, 0.1 ), between( 0.2, 0.8 ) ) ;
  }));
}

function getPalette() {
  return getGrayscalePalette().concat( getColorPalette() ) ;
}

function Rect( x1, y1, x2, y2 ) {
  Object.defineProperties( this, {
    left:   { value: x1 },
    right:  { value: x2 },
    top:    { value: y1 },
    bottom: { value: y2 },
    width:  { value: x2 - x1 },
    height: { value: y2 - y1 }
  });
}

function inside( rect ) {
  var x1 = between( rect.left, rect.right ), x2 = between( rect.left, rect.right ) ;
  var y1 = between( rect.top, rect.bottom ), y2 = between( rect.top, rect.bottom ) ;
  
  return new Rect( Math.min( x1, x2 ), Math.min( y1, y2 ), Math.max( x1, x2 ), Math.max( y1, y2 ) ) ;
}

function drawPalette( palette ) {
  palette.map( function( color, index ) {
    context.fillStyle = color.css ;
    context.fillRect( canvas.width / palette.length * index, 0, canvas.width / palette.length * ( index + 1 ), canvas.height ) ;
  });
}

function rectangle( bounds, palette ) {
  var rect = inside( bounds ) ;
  
  context.fillStyle = from( palette ).css ;
  context.fillRect( rect.left, rect.top, rect.width, rect.height ) ;
}

function square( bounds, palette ) {
  var min = Math.min( bounds.width, bounds.height ) / 2 ;
  var dx = between( -min, min ), dy = between( -min, min ) ;
  var w = Math.max( Math.abs( dx ), Math.abs( dy ) ) ;
  var x = between( bounds.left + w, bounds.right - w ) ;
  var y = between( bounds.top + w, bounds.bottom - w ) ;
  
  context.beginPath() ;
  context.moveTo( x + dx, y + dy ) ;
  context.lineTo( x + dy, y - dx ) ;
  context.lineTo( x - dx, y - dy ) ;
  context.lineTo( x - dy, y + dx ) ;
  context.closePath() ;
  
  context.fillStyle = from( palette ).css ;
  context.fill() ;
}

function ngon( bounds, palette ) {
  context.beginPath() ;
  
  context.moveTo( between( bounds.left, bounds.right ), between( bounds.top, bounds.bottom ) ) ;
  
  repeat( 5, 12, function() {
    context.lineTo( between( bounds.left, bounds.right ), between( bounds.top, bounds.bottom ) ) ;
  });
  
  context.closePath() ;
  context.fillStyle = from( palette ).css ;
  context.fill() ;
}

function strip( bounds, palette ) {
  var min = Math.min( bounds.width, bounds.height ) ;
  var x1 = between( bounds.left - bounds.width, bounds.right + bounds.width ), x2 = between( bounds.left - bounds.width, bounds.right + bounds.width ) ;
  var y1 = between( bounds.top - bounds.height, bounds.bottom + bounds.height ), y2 = between( bounds.top - bounds.height, bounds.bottom + bounds.height ) ;
  
  var c1x = ( x2 - x1 ) * 0.4 + min * between( 0.2, -0.2 ) ;
  var c1y = ( y2 - y1 ) * 0.4 + min * between( 0.2, -0.2 ) ;
  var c2x = ( x1 - x2 ) * 0.4 + min * between( 0.2, -0.2 ) ;
  var c2y = ( y1 - y2 ) * 0.4 + min * between( 0.2, -0.2 ) ;
  
  // This dragon here shall select a color or maybe two
  new Array( Math.floor( between( 0, 3 ) ) ).fill( from( palette ) ).concat( new Array( Math.floor( between( 2, 4 ) ) ).fill( from( palette ) ) ).map( function( color ) {
    context.beginPath() ;
    context.moveTo( x1 + min * between( 0.1, -0.1 ), y1 + min * between( 0.1, -0.1 ) ) ;
    context.bezierCurveTo( x1 + c1x + min * between( 0.1, -0.1 ), y1 + c1y + min * between( 0.1, -0.1 ), x2 + c2x + min * between( 0.1, -0.1 ), y2 + c2y + min * between( 0.1, -0.1 ), x2 + min * between( 0.1, -0.1 ), y2 + min * between( 0.1, -0.1 ) ) ;
    context.lineWidth = min * between( 0.04, 0.06 ) ;
    context.strokeStyle = color.css ;
    context.stroke() ;
    context.closePath() ;
  });
}

function splash( bounds, palette ) {
  var min = Math.min( bounds.width, bounds.height ) ;
  var x = between( bounds.left, bounds.right ), y = between( bounds.top, bounds.bottom ) ;
  var dx = x - between( bounds.left, bounds.right ), dy = y - between( bounds.top, bounds.bottom ) ;
  var sx = x, sy = y, sdx = dx, sdy = dy ;
  context.moveTo( sx, sy ) ;
  
  repeat( 2, 6, function() {
    var nx = between( bounds.left, bounds.right ), ny = between( bounds.top, bounds.bottom ) ;
    var ndx = nx - between( bounds.left, bounds.right ), ndy = ny - between( bounds.top, bounds.bottom ) ;
    context.bezierCurveTo( x + dx, y + dy, nx - ndx, ny - ndy, nx, ny ) ;
    x = nx ; y = ny ; dx = ndx ; dy = ndy ;
  });
  
  context.bezierCurveTo( x + dx, y + dy, sx - sdx, sy - sdy, sx, sy ) ;
  context.fillStyle = from( palette ).css ;
  context.fill() ;
}

function drawArt() {
  var palette = getPalette() ;
  
  context.fillStyle = palette[ Math.floor( Math.pow( Math.random(), 2 ) * palette.length ) ].css ;
  context.fillRect( 0, 0, canvas.width, canvas.height ) ;
  
  context.lineCap = 'round' ;
  
  var bounds = new Rect( 0, 0, canvas.width, canvas.height ) ;
  repeat( 3, 7, function() {
    drawGlances( 0, bounds, palette ) ;
  });
  repeat( 2, 4, function() {
    drawGlances( 1, bounds, palette ) ;
  });
  drawGlances( 2, bounds, palette ) ;
}

function drawGlances( depth, bounds, palette ) {
  if( depth > 0 ) {
    repeat( 2, 4, function() {
      drawGlances( depth - 1, inside( bounds ), palette ) ;
    });
  } else {
    from( rectangle, square, strip, splash, rectangle, square, strip, splash, ngon )( bounds, palette ) ;
  }
}

// Below thou shall find the library of names

var mythologyNames = ["Acantha","Achilles","Achilleus","Adad","Aditi","Aditya","Adonis","Adrastea","Adrasteia","Adrastos","Aegle","Aella","Aeneas","Aeolus","Aeron","Aeson","Agamemnon","Agaue","Aglaea","Aglaia","Agni","Agrona","Ahriman","Ahti","Ahura","Aias","Aigle","Ailill","Aineias","Aino","Aiolos","Ajax","Akantha","Alberic","Alberich","Alcides","Alcippe","Alcyone","Alecto","Alekto","Alexander","Alexandra","Alexandros","Alf","Alfr","Alkeides","Alkippe","Alkyone","Althea","Alvis","Amalthea","Amaterasu","Amen","Ameretat","Amirani","Ammon","Amon","Amordad","Amulius","Amun","Amurdad","An","Anahit","Anahita","Anaitis","Ananta","Anapa","Anat","Anath","Anatu","Andraste","Andromache","Andromeda","Angerona","Angharad","Angra","Anil","Aniruddha","Anoubis","Anthea","Antheia","Antigone","Antiope","Anu","Anubis","Aodh","Aoede","Aoide","Aoife","Aonghus","Aphrodite","Apollo","Apollon","Ara","Arachne","Aramazd","Aranrhod","Arash","Arawn","Ares","Arethousa","Arethusa","Argus","Ariadne","Arianrhod","Aries","Aristaeus","Aristaios","Aristodemos","Arjuna","Armazi","Artemis","Arthur","Aruna","Arundhati","Asar","Asherah","Ashtad","Ashtoreth","Ask","Asklepios","Askr","Astarte","Astraea","Astraia","Atalanta","Atem","Aten","Athena","Athene","Atlas","Aton","Atropos","Atum","Aurora","Aust","Azrael","Ba","Baal","Bacchus","Bahman","Bahram","Bala","Baladeva","Balder","Baldr","Baltazar","Balthasar","Balthazar","Barlaam","Bast","Bastet","Batraz","B","Bedivere","Bedwyr","Belenos","Belenus","Beli","Belial","Bellona","Beowulf","Bharata","Bhaskara","Bhima","Bhumi","Bile","Bl","Blodeuwedd","Borghild","Borghildr","Brahma","Br","Bran","Branwen","Bridget","Brighid","Brigid","Brigit","Brijesha","Briseis","Brontes","Brunhild","Brynhildr","Byelobog","C","Cai","Calliope","Callisto","Calypso","Camilla","Cardea","Carme","Caspar","Cassandra","Cassiopea","Cassiopeia","Castor","Cephalus","Cepheus","Cerberus","Ceres","Cernunnos","Chalchiuhticue","Chandra","Charon","Chernobog","Chi","Chloe","Chloris","Chryseis","Chryses","Chukwu","Cian","Circe","Cl","Clio","Clotho","Clytemnestra","Clytia","Coeus","Conall","Conchobhar","Conch","Concordia","Conlaoch","Connla","Conor","Consus","Cora","Crius","Cronus","Culhwch","Cupid","Cybele","Cynthia","Daedalus","Dagan","Dagda","Dagon","D","Daireann","Dalia","Damayanti","Damocles","Damodara","Damokles","Damon","Dana","Daphne","Dardanos","Dazbog","Dazhdbog","Deimos","Deirdre","Delia","Demeter","Derdriu","Despoina","Devaraja","Devi","Diana","Diarmaid","Diarmait","Diarmuid","Dido","Dike","Dilipa","Diomedes","Dione","Dionysos","Dionysus","Dipaka","Dismas","Djehuti","Doireann","Doirend","Donar","Doris","Draupadi","Drupada","Durga","Dwyn","Dylan","Ea","Echo","Eigyr","Eileithyia","Eir","Eirene","El","Electra","Elektra","Elissa","Ellil","Elpis","Embla","Emer","Endymion","Enid","Enki","Enlil","Enyo","E","Eoghan","Eos","Epimetheus","Epona","Erato","Erebos","Erebus","Ereshkigal","Eris","Erna","Eros","Etzel","Euadne","Euandros","Euanthe","Eudora","Eunomia","Euphrosyne","Europa","Europe","Eurydice","Eurydike","Euterpe","Evadne","Evander","Evandrus","Fachtna","Fauna","Faunus","Fearghas","Fedelm","Fedelmid","Fedlimid","Feidelm","Feidlimid","Felicitas","Fereydoun","Fergus","Fiachra","Finn","Finnguala","Finnuala","Fintan","Fionn","Fionnghuala","Fionnuala","Flora","Frea","Frey","Freya","Freyja","Freyr","Frige","Frigg","Gabija","Gaea","Gaia","Gandalf","Ganesh","Ganesha","Ganymede","Ganymedes","Gaspar","Gauri","Gemini","Geraint","Gerd","Gilgamesh","Girisha","Glaucus","Glaukos","Glooscap","Goibniu","Gopala","Gopinatha","Goronwy","Gotama","Govad","Govannon","Govinda","Gr","Grid","Grimhilt","Gudrun","Gundahar","Gunnar","Gunnarr","Gunnr","G","Gu","Gwalchmei","Gwenhwyfar","Gwydion","Hadad","Hades","Halcyone","Halkyone","Hari","Harisha","Harmonia","Hathor","Haurvatat","Hebe","Hecate","Hector","Hecuba","Heidrun","Hei","Hekabe","Hekate","Hektor","Hel","Helen","Helena","Helene","Helios","Helle","Hemera","Hephaestus","Hephaistos","Hera","Heracles","Herakles","Hercules","Hermes","Hermione","Hero","Hersilia","Heru","Hestia","Het","Hildr","Hippolyta","Hippolyte","Hippolytos","Hormazd","Horos","Horus","Huld","Hulda","Hvare","Hyacinth","Hyacinthus","Hyakinthos","Hyperion","Iacchus","Iah","Ianthe","Ianus","Iapetos","Iapetus","Iason","Icarus","Idun","Ilithyia","Ilmarinen","Ilmatar","Inanna","Indira","Indra","Indrajit","Indrani","Ing","Io","Ioachim","Ioakeim","Iole","Ion","Ione","Iovis","Iphigeneia","Iphigenia","Irene","Iris","Iset","Iseult","Ishtar","Isis","Ismene","Isolda","Isolde","Israfil","Italus","I","Iuno","Iuppiter","Ixchel","Izanagi","Izanami","Jagannatha","Jam","Jamshed","Jamsheed","Jamshid","Janus","Jarl","Jason","Jasper","Jaya","Jayanta","Jayanti","Jimmu","Joachim","Jocasta","Joukahainen","Jove","Juno","Jupiter","Juturna","Juventas","Kali","Kalliope","Kallisto","Kalyani","Kalypso","Kama","Kamala","Kanti","Kapila","Karme","Karna","Kassandra","Kassiopeia","Kastor","Kaveh","Kay","Kephalos","Kepheus","Kerberos","Khordad","Khurshid","Kirke","Kleio","Klotho","Klytaimnestra","Klyti","Koios","Kore","Kor","Kreios","Kriemhild","Krishna","Kronos","Kshathra","Kumara","Kumari","Kunti","Kyllikki","Kynthia","Lachesis","Laima","Lakshmana","Lakshmi","Lalita","Lamia","Lara","Larisa","Larunda","Lauma","Laverna","Lavinia","Leander","Leandros","Lech","Leda","Lemmink","Leto","Liber","Libitina","Ligeia","Lilith","Linos","Linus","Lir","Lleu","Llew","Llyr","L","Loke","Loki","Lorelei","Louhi","Loviatar","Lucifer","Lucina","Lucretia","Lug","Lugaid","Lugh","Lughaidh","Lugos","Lugus","Luna","Luned","Lunete","Lycurgus","Lycus","Lykos","Lykourgos","Mabon","Madhava","Madhavi","Maeve","Mahesha","Maia","Mani","Manu","Marama","Marduk","Mari","Mars","Marzanna","Math","Maui","Maya","M","Meadhbh","Medb","Medea","Medeia","Medousa","Medraut","Medrod","Medusa","Megaera","Megaira","Mehr","Melaina","Melanthios","Melchior","Melete","Melia","Melissa","Melpomene","Melqart","Melusine","Menelaos","Menelaus","Mentor","Mercurius","Mercury","Mictlantecuhtli","Midas","Mielikki","Milda","Mina","Minerva","Mithra","Mithras","Mitra","Mneme","Mnemosyne","Modred","Mohana","Mohini","Mokosh","Morana","Mordad","Mordred","Morpheus","Morrigan","Mot","Muirenn","Muirgen","Muirne","Mukesha","Murali","Myrddin","Nabu","Naenia","Nairyosangha","Nala","Nanabozho","Nanaea","Nanaia","Nanaya","Nanda","Nanna","Naoise","Narayana","Narcissus","Narkissos","Nausicaa","Nausikaa","Neas","Neasa","Nechtan","Neith","Nemesis","Neoptolemos","Neoptolemus","Nephele","Nephthys","Neptune","Neptunus","Nereus","Nerthus","Ness","Nessa","Nestor","Niamh","Nike","Nikephoros","Nina","Ningal","Niobe","Nit","Nj","Njord","Nokomis","Nona","Nuada","Nuadha","Nudd","Numitor","Nyx","Nyyrikki","Oceanus","Oden","Odin","Odysseus","Oedipus","Oenone","Oidipous","Oinone","Ois","Okeanos","Orestes","Orion","Ormazd","Orpheus","Orvar","Oscar","Osiris","Ourania","Ouranos","Owain","Padma","Padmavati","Pallas","Pan","Pandora","Pankaja","Papa","Paris","Partha","Parthal","Parthenia","Parthenope","Parvati","Patroclus","Patroklos","Pax","Pegasus","Pekko","Pele","Penelope","Peredur","Persephone","Perseus","Perun","Phaedra","Phaenna","Phaidra","Phanuel","Philander","Philandros","Philomela","Phobos","Phoebe","Phoebus","Phoibe","Phoibos","Phrixos","Phrixus","Phyllis","Pistis","Pitambara","Plouton","Pluto","Pollux","Polydeukes","Polyhymnia","Polymnia","Polyxena","Polyxene","Pomona","Poseidon","Prabhu","Pramoda","Praxis","Priam","Priamos","Pritha","Priya","Prometheus","Proserpina","Proserpine","Proteus","Pryderi","Psyche","Ptah","Puck","Purushottama","Pwyll","Pyrrhos","Pyrrhus","Pythios","Quetzalcoatl","Quirinus","Ra","Radha","Raghu","Raguel","Raiden","Raijin","Rajani","Rama","Ramachandra","Ramesha","Rangi","Rashn","Rashnu","Rati","Ravi","Re","Remiel","Remus","Reva","Rhea","Rheia","Rhiannon","Rigantona","R","Romulus","Rostam","Rukmini","Saam","Sabia","Sachin","Sadb","Sadbh","Sadhbh","Saga","Salacia","Sam","Samael","Sampo","Sandhya","Sanjaya","Saraswati","Sarosh","Sarpedon","Sati","Saturn","Saturnus","Saule","Saul","Sauli","Savitr","Savitri","Sedna","Selena","Selene","Semele","Seppo","Set","Seth","Shahrivar","Shailaja","Shakti","Shankara","Shanta","Shantanu","Shiva","Shivali","Shri","Shripati","Shyama","Siavash","Siegfried","Sieglinde","Sif","Sign","Sigr","Sigurd","Sigur","Silvanus","Silvia","Silvius","Sindri","Sionann","Sita","Siv","Skanda","Ska","Skuld","Sohrab","Soroush","Sosruko","Sraosha","Sri","Stribog","Sumati","Summanus","Sundara","Sunita","Suresha","Surya","Sushila","Sutekh","Svanhild","Svanhildr","Svarog","Tahmuras","Takhma","Tane","Tangaroa","Tanis","Tanit","Tanith","Tapio","Tara","Taranis","Tatius","Tellervo","Terminus","Terpsichore","Tethys","Thaleia","Thalia","Thanatos","Theia","Themis","Theseus","Thor","Thoth","Tiamat","Tisiphone","Tiw","Tlaloc","Tristan","Tuulikki","T","Tyr","Ukko","Ulysses","Uma","Urania","Uranus","Urd","Urien","Usha","Ushas","Uther","Uthyr","Utu","Vahagn","V","Valli","Varuna","Vasanta","Vasu","Vayu","Veles","Vellamo","Venus","Verdandi","Verethragna","Vesta","Victoria","Vidar","Vidya","Vijaya","Vikrama","Vishnu","Vohu","Volos","Vulcan","Weland","Wieland","Wodan","Woden","Wotan","Xanthe","Xochipilli","Xochiquetzal","Yam","Yama","Yamanu","Yami","Yeruslan","Yima","Yngvi","Ysolt","Zal","Zaramama","Zephyr","Zephyros","Zephyrus","Zerachiel","Zeus"] ;
var adjectives = ["Accepting","Accommodating","Afraid","Aggressive","Agitated","Alarmed","Amazed","Amused","Antagonistic","Anxious","Apathetic","Apprehensive","Arrogant","Astonished","Astounded","Attentive","Blase","Bold","Bothered","Brave","Calm","Capable","Casual","Charming","Cheerful","Cheery","Churlish","Collected","Comfortable","Competitive","Composed","Compulsive","Concerned","Confident","Conflicted","Conscientious","Conservative","Considerate","Conspicuous","Contemptible","Content","Convivial","Cool","Courageous","Covetous","Creative","Critical","Curious","Cynical","Dazzled","Debilitated","Defensive","Dejected","Delighted","Demeaned","Depressed","Destructive","Devious","Devoted","Dictatorial","Diffident","Disdainful","Distracted","Distraught","Distressed","Downcast","Earnest","Edgy","Elated","Empathetic","Enthusiastic","Euphoric","Exhausted","Expectant","Explosive","Exuberant","Ferocious","Fierce","Flabbergasted","Flexible","Focused","Forgiving","Forlorn","Frightened","Furtive","Gloomy","Good","Grateful","Grouchy","Guilty","Happy","Harassed","Heroic","Hesitant","Hopeful","Hostile","Humble","Humorous","Hysterical","Idealistic","Ignorant","Ill-tempered","Impartial","Impolite","Imprudent","Indifferent","Infuriated","Insightful","Insulted","Intense","Intimidated","Intolerant","Irascible","Jealous","Jolly","Jovial","Joyful","Jubilant","Jumpy","Kind","Languid","Liberal","Loving","Loyal","Magical","Magnificent","Malevolent","Malicious","Mysterious","Needy","Negative","Neglected","Nervy","Opinionated","Panicky","Passionate","Patient","Perturbed","Petrified","Petulant","Placid","Pleased","Powerful","Prejudicial","Prideful","Quarrelsome","Queasy","Quivering","Rancorous","Rational","Reasonable","Reckless","Reflective","Remorseful","Repugnant","Resilient","Resolute","Resourceful","Respectful","Responsible","Responsive","Restorative","Reverent","Rude","Ruthless","Sad","Safe","Scared","Scornful","Seething","Selfish","Sensible","Sensitive","Serene","Shaky","Shivering","Shocked","Sickly","Simple","Sober","Solemn","Somber","Sour","Speechless","Spooked","Stern","Successful","Sullen","Superior","Supportive","Surly","Suspicious","Sweet","Sympathetic","Tactful","Tenacious","Tense","Terrific","Testy","Thoughtful","Thoughtless","Timorous","Tolerant","Tranquil","Treacherous","Trembling","Truthful","Ultimate","Uncivil","Uncouth","Uneasy","Unethical","Unfair","Unique","Unmannerly","Unnerved","Unrefined","Unruffled","Unsavory","Unworthy","Uplifting","Upset","Uptight","Versatile","Vicious","Vigilant","Vigorous","Vile","Villainous","Virtuous","Vivacious","Volatile","Vulnerable","Warm","Wary","Waspish","Weak","Welcoming","Wicked","Wild","Wise","Wishy-washy","Wistful","Witty","Woeful","Wonderful","Worrying","Worthy","","Youthful","Zany","Zealous"] ;
var feels = ["Acceptance","Admiration","Adoration","Affection","Afraid","Agitation","Agreeable","Aggressive","Aggravation","Agony","Alarm","Alienation","Amazement","Amusement","Anger","Angry","Anguish","Annoyance","Anticipation","Anxiety","Apprehension","Assertive","Assured","Astonishment","Attachment","Attraction","Awe","Beleaguered","Bewitched","Bitterness","Bliss","Blue","Boredom","Calculating","Calm","Capricious","Caring","Cautious","Charmed","Cheerful","Closeness","Compassion","Complacent","Compliant","Composed","Contempt","Conceited","Concerned","Content","Contentment","Crabby","Crazed","Crazy","Cross","Cruel","Defeated","Defiance","Delighted","Dependence","Depressed","Desire","Disappointment","Disapproval","Discontent","Disenchanted","Disgust","Disillusioned","Dislike","Dismay","Displeasure","Dissatisfied","Distraction","Distress","Disturbed","Dread","Eager","Earnest","Easy-going","Ecstasy","Ecstatic","Elation","Embarrassment","Emotion","Emotional","Enamored","Enchanted","Enjoyment","Enraged","Enraptured","Enthralled","Enthusiasm","Envious","Envy","Equanimity","Euphoria","Exasperation","Excited","Exhausted","Extroverted","Exuberant","Fascinated","Fatalistic","Fear","Fearful","Ferocity","Flummoxed","Flustered","Fondness","Fright","Frightened","Frustration","Furious","Fury","Generous","Glad","Gloating","Gloomy","Glum","Greedy","Grief","Grim","Grouchy","Grumpy","Guilt","Happiness","Happy","Harried","Homesick","Hopeless","Horror","Hostility","Humiliation","Hurt","Hysteria","Infatuated","Insecurity","Insulted","Interested","Introverted","Irritation","Isolation","Jaded","Jealous","Jittery","Jolliness","Jolly","Joviality","Jubilation","Joy","Keen","Kind","Kindhearted","Kindly","Laid back","Lazy","Like","Liking","Loathing","Lonely","Longing","Loneliness","Love","Lulled","Lust","Mad","Merry","Misery","Modesty","Mortification","Naughty","Neediness","Neglected","Nervous","Nirvana","Open","Optimism","Ornery","Outgoing","Outrage","Panic","Passion","Passive","Peaceful","Pensive","Pessimism","Pity","Placid","Pleased","Pride","Proud","Pushy","Quarrelsome","Queasy","Querulous","Quick-witted","Quiet","Quirky","Rage","Rapture","Rejection","Relief","Relieved","Remorse","Repentance","Resentment","Resigned","Revulsion","Roused","Sad","Sadness","Sarcastic","Sardonic","Satisfaction","Scared","Scorn","Self-assured","Self-congratulatory","Self-satisfied","Sentimentality","Serenity","Shame","Shock","Smug","Sorrow","Sorry","Spellbound","Spite","Stingy","Stoical","Stressed","Subdued","Submission","Suffering","Surprise","Sympathy","Tenderness","Tense","Terror","Threatening","Thrill","Timidity","Torment","Tranquil","Triumphant","Trust","Uncomfortable","Unhappiness","Unhappy","Upset","Vain","Vanity","Venal","Vengeful","Vexed","Vigilance","Vivacious","Wary","Watchfulness","Weariness","Weary","Woe","Wonder","Worried","Wrathful","Zeal","Zest"] ;
var places = ["Agartha", "Alfheim", "Annwn", "Arcadia", "Asgard", "Asphodel Meadows", "Atlantis", "Avalon", "Axis Mundi", "Ayotha Amirtha Gangai", "Aztlán", "Baltia", "Barzakh", "Biarmaland", "Brahmapura", "Brasil", "Hy-Brasil", "Brittia", "Camelot", "City of the Caesars", "Cloud cuckoo land", "Cockaigne", "Dinas Affaraon", "El Dorado", "Elysian Fields", "Garden of Eden", "Garden of the Hesperides", "Gorias", "Finias", "Murias", "Falias", "Hawaiki", "Heaven", "Hel", "Hell", "Hyperborea", "Irkalla", "Islands of the Blessed", "Jotunheim", "Kingdom of Reynes", "Kingdom of Saguenay", "Kolob", "Kvenland", "Kyöpelinvuori", "La Ciudad Blanca", "Laestrygon", "Lake Parime", "Lemuria", "Lyonesse", "Mag Mell", "Meropis", "Mictlan", "Mount Olympus", "Mu", "Muspelheim", "Nibiru", "Niflheim", "Niflhel", "Norumbega", "Nysa", "Paititi", "Pandæmonium", "Purgatory", "Quivira","Cíbola", "Scholomance", "Shambhala", "Shangri-La", "Sierra de la Plata", "Sodom","Gomorrah", "Suddene", "Summerland", "Svartálfaheimr", "Takama-ga-hara", "Tartarus", "Themiscyra", "Thule", "Thuvaraiyam Pathi", "Tir na nÓg", "Valhalla", "Westernesse", "Xibalba", "Yomi", "Ys", "Zion"] ;

function nameTheAdjective() {
  return from( mythologyNames ) + ' the ' + from( adjectives ) ;
}

function adjectiveName() {
  return from( adjectives ) + ' ' + from( mythologyNames ) ;
}

function feel() {
  return from( feels ) ;
}

function adjectiveFeel() {
  return from( adjectives ) + ' ' + from( feels ) ;
}

function feelOfName() {
  return from( feels ) + ' of ' + from( mythologyNames ) ;
}

function place() {
  return from( places ) ;
}

function adjectivePlace() {
  return from( adjectives ) + ' ' + from( places ) ;
}

function getName() {
  return from( feel, feel, feel, nameTheAdjective, adjectiveName, place, adjectivePlace )() ;
}