// Firebase കോൺഫിഗറേഷൻ (നിങ്ങൾ നൽകിയ വിവരങ്ങൾ)
const firebaseConfig = {
    apiKey: "AIzaSyDxKaF7sFUCsbcyZ9FkQxZtpvBL5Ga-yew",
    authDomain: "gk-app-2274e.firebaseapp.com",
    projectId: "gk-app-2274e",
    storageBucket: "gk-app-2274e.firebasestorage.app",
    messagingSenderId: "249982405152",
    appId: "1:249982405152:web:dd441a778ab94d86078a45",
    measurementId: "G-50X2DDE274"
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

    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('phone', '==', phone).get();

    if (snapshot.empty) {
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
                window.location.href = "dashboard.html";
            }, 1000);
        } else {
            messageBox.style.color = "#d32f2f";
            messageBox.innerText = "നിങ്ങളുടെ അക്കൗണ്ട് അഡ്മിൻ ഇതുവരെ അപ്പ്രൂവ് ചെയ്തിട്ടില്ല.";
        }
    }
}
