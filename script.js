// Firebase കോൺഫിഗറേഷൻ (നിങ്ങളുടെ ഫയർബേസ് പ്രൊജക്റ്റ് ഡാറ്റ ഇവിടെ നൽകുക)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

async function handleLoginRegister() {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const messageBox = document.getElementById('status-message');

    if (!phone) {
        messageBox.innerText = "ദയവായി മൊബൈൽ നമ്പർ നൽകുക!";
        return;
    }

    // യൂസർ ഡാറ്റാബേസിൽ ഉണ്ടോ എന്ന് പരിശോധിക്കുന്നു
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('phone', '==', phone).get();

    if (snapshot.empty) {
        // പുതിയ യൂസർ രജിസ്ട്രേഷൻ (സ്റ്റാറ്റസ്: pending)
        if (!name) {
            messageBox.innerText = "പുതിയ യൂസറാണ്, ദയവായി പേര് കൂടി നൽകുക!";
            return;
        }

        await usersRef.add({
            name: name,
            phone: phone,
            status: 'pending', // അഡ്മിൻ അപ്പ്രൂവൽ ആവശ്യമാണ്
            score: 0,
            currentLevel: 1
        });

        messageBox.style.color = "#00796b";
        messageBox.innerText = "രജിസ്ട്രേഷൻ വിജയകരമായി! അഡ്മിന്റെ അപ്പ്രൂവലിനായി കാത്തിരിക്കുക.";
    } else {
        // നിലവിലുള്ള യൂസർ
        let userData = null;
        snapshot.forEach(doc => {
            userData = doc.data();
        });

        if (userData.status === 'approved') {
            messageBox.style.color = "#00796b";
            messageBox.innerText = "ലോഗിൻ വിജയം! ഹോം പേജിലേക്ക് പോകുന്നു...";
            localStorage.setItem('userPhone', phone);
            localStorage.setItem('userName', userData.name);
            setTimeout(() => {
                window.location.href = "dashboard.html"; // അടുത്ത പേജ്
            }, 1000);
        } else {
            messageBox.style.color = "#d32f2f";
            messageBox.innerText = "നിങ്ങളുടെ അക്കൗണ്ട് അഡ്മിൻ ഇതുവരെ അപ്പ്രൂവ് ചെയ്തിട്ടില്ല.";
        }
    }
}
