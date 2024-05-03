# Api - Användarhantering och inloggning samt lagra användarspecifika CV i databas
Detta repository innehåller kod för ett enklare REST API byggt med Express. Apiet kan ta emot CRUD (Create, Read, Update, Delete). Apiet är tänkt att användas för att göra ett digitalt CV som lagras i en mongoDb-databas hos Atlas/mongoDb.

## Testwebbplats
Följ denna [länk](https://personligt-cv.netlify.app/) om du vill testa funktionerna och se ett exempel på hur APIet är tänkt att användas. För att se repot för testwebbplatsen följ denna [länk](https://github.com/MarkusVickman/dt207g-moment4-frontend).

## Lösenordshantering
Lösenorden är hashade och går inte att se eller återställa till klartext. Användaren är den ända som vet sitt valda lösenord.

## Installation, databas
APIet använder en mongoDb-databas. För att ansluta till din databas måste environment variables för inloggningsuppgifter lagras hos din valda webbhost. Den här webbtjänsten använder [Atlas/mongoDb](https://www.mongodb.com/atlas) till sin mongoDb server. Webbadress till databasen finns under connections inne i atlas gränssnittet. För att säkerställa att input-data följde en viss struktur användes mongoose istället för mongoDb för att ansluta till databasen i nodeJs. Mongoose installeras som tillägg i node.js. Föjande scheman användes till mongoose för att säkertställa rätt struktur:

### Schema - Inloggning/Registrering
```
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});
```

### Schema - CV-inlägg
```
const WorkSchema = mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});
```

## Användning - Inloggning/Registrering
För registrering räcker det att skicka med ett användarnamn som inte redan finns i databasen och ett lösenord.
Vid inloggning med giltigt användarnamn och lösenord skickas en JWT-token tillbaka i svaret vid inloggning i JSON format. { messege: "Login successful", token: token }. Token kan lämplig lagras i localstorage, sessionstorage, cookie eller ännu bättre http only cookie.
Nedan finns beskrivet hur man nå APIet på olika vis:

|Metod  |Ändpunkt                      |Beskrivning                                                       |
|-------|------------------------------|------------------------------------------------------------------|
|POST   |/api/login                    |Logga in användare och hämtar JWT-token.                          |
|POST   |/api/register                 |Registrerar en användare.                                         |
|GET    |/api/protected/user           |För att hämta användaruppgifter i JSON-format                     |
|DELETE |/api/protected/user/delete    |Raderar en användare som identifieras med JWT-token.              |

För inloggning/registrering skickas följande struktur som JSON:

```
{
"username": "Markus"
"password": "MittSäkraLösenord"
}
```

Svar vid inloggning giltig inloggning returnerar JSON:

```
{ messege: "Login successful", token: token }
```

För att hämta information om användaren eller ta bort användaren skickas endast JWT-token i headern:

```
headers: {
            'authorization': 'Bearer ' + sessionStorage.getItem("token")
        }. 
```

## Användning - cv-inlägg
För att få åtkomst till dessa måste användaren först logga in för att hämta en JWT-token. JWT-token skickas tillbaka i svaret vid inloggning i JSON format: { messege: "Login successful", token: token }. Token kan lämplig lagras i localstorage, sessionstorage, cookie eller ännu bättre http only cookie. Denna JWT-token ska skickas med i headern på detta sätt:  

```
headers: {
            'authorization': 'Bearer ' + sessionStorage.getItem("token")
        }.
```

Nedan finns beskrivet hur man nå APIet på olika vis:

|Metod  |Ändpunkt                  |Beskrivning                                                                          |
|-------|--------------------------|-------------------------------------------------------------------------------------|
|GET    |/api/protected/cv         |Hämtar alla lagrade CV-inlägg.                                                       |
|POST   |/api/protected/add        |Lagrar ett nytt cv. Kräver att alla parametrar för tabellen skickas med utom id.     |
|PUT    |/api/protected/edit       |Uppdaterar ett inlägg. Kräver skicka med de parametrar du vill ändra inklusive id.   |
|DELETE |/api/protected/delete/:ID |Raderar ett CV-inlägg med angivet ID. Inläggs id skickas med som parameter.                                               |

Ett CV-objekt returneras/skickas som JSON med följande struktur:
```
{
"_Id": "661f90b1d715c9d977ca8023", //Behövs bara för att ändra ett befintligt inlägg eller för att tabort ett inlägg
"companyName": "Region Västernorrland",
"jobTitle": "Handläggare",
"location": "Örnsköldsvik",
"startDate": "2017-03-30",
"endDate": "2023-06-23",
"description": "Vända på och sortera papper.... samt ta seriösa beslut."
}
```
