document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const themeToggleCheckbox = document.getElementById('theme-toggle-checkbox');
    const bodyElement = document.body;
    const clearChatButton = document.getElementById('clear-chat-button');

    // HAMBURGERMENY ELEMENTER
    const hamburgerButton = document.getElementById('hamburger-button');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const loginButtonMenu = document.getElementById('login-button-menu');

    // Sørg for at denne URL-en er korrekt for din Replit backend
    const backendUrl = 'https://b9280818-97da-4f17-9c2e-db08824cd4f1-00-2btl4c4c21klj.picard.replit.dev/chat';

    // --- TEMABYTTING ---
    // Med den nye CSS-en er standardtemaet mørkt.
    // Denne logikken vil legge til 'dark-mode'-klassen for et *alternativt* mørkt tema
    // eller fjerne den for å gå tilbake til standard (som nå er mørkt).
    // Hvis du vil at toggle skal bytte til et *lyst* tema, må du definere .dark-mode i CSS som lyst.
    const toggleTheme = () => {
        if (themeToggleCheckbox.checked) {
            bodyElement.classList.add('dark-mode'); // Aktiverer alternativt mørkt tema (eller lyst hvis CSS er endret)
            localStorage.setItem('theme', 'dark'); // Eller 'light-theme-active'
        } else {
            bodyElement.classList.remove('dark-mode'); // Går til standard CSS-tema (som nå er mørkt)
            localStorage.setItem('theme', 'default-dark'); // Eller 'dark' hvis default er mørkt
        }
    };

    const savedTheme = localStorage.getItem('theme');
    // Oppdater logikken her basert på hvordan du vil at tema-lagring skal fungere
    // Med den nye CSS-en (standard mørk), kan dette forenkles eller endres.
    // Eksempel: Hvis 'default-dark' er lagret, eller ingenting er lagret, gjør ingenting (CSS håndterer det).
    // Hvis 'dark' (som betyr alternativ mørk) er lagret, sett checkbox og class.
    if (savedTheme === 'dark') { // Antar 'dark' betyr det alternative mørke temaet
        bodyElement.classList.add('dark-mode');
        if (themeToggleCheckbox) themeToggleCheckbox.checked = true;
    } else { // For 'default-dark' eller ingen lagret verdi
        bodyElement.classList.remove('dark-mode');
        if (themeToggleCheckbox) themeToggleCheckbox.checked = false;
    }
    // Hvis du ønsker at standard skal være det mørke temaet uten 'dark-mode' klassen,
    // og at theme-toggle legger til 'light-mode' klassen:
    // if (savedTheme === 'light') {
    //     bodyElement.classList.add('light-mode'); // Du må definere .light-mode i CSS
    //     if(themeToggleCheckbox) themeToggleCheckbox.checked = true; // Eller inverter logikken for checkbox
    // } else {
    //     bodyElement.classList.remove('light-mode');
    //     if(themeToggleCheckbox) themeToggleCheckbox.checked = false;
    // }


    if (themeToggleCheckbox) {
        themeToggleCheckbox.addEventListener('change', toggleTheme);
    }

    // --- LOGIKK FOR HAMBURGERMENY ---
    if (hamburgerButton && dropdownMenu) {
        hamburgerButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const isExpanded = hamburgerButton.getAttribute('aria-expanded') === 'true' || false;
            hamburgerButton.setAttribute('aria-expanded', !isExpanded);
            dropdownMenu.classList.toggle('open');
        });

        document.addEventListener('click', (event) => {
            if (dropdownMenu.classList.contains('open') &&
                !dropdownMenu.contains(event.target) &&
                event.target !== hamburgerButton &&
                !hamburgerButton.contains(event.target)) {
                dropdownMenu.classList.remove('open');
                hamburgerButton.setAttribute('aria-expanded', 'false');
            }
        });
    }

    if (loginButtonMenu) {
        loginButtonMenu.addEventListener('click', () => {
            alert('Logg inn-funksjonalitet er ikke implementert ennå.');
            if (dropdownMenu && dropdownMenu.classList.contains('open')) {
                dropdownMenu.classList.remove('open');
                if (hamburgerButton) {
                    hamburgerButton.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }

    // --- HJELPEFUNKSJONER FOR MELDINGER ---
    function formatTime(date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    function addTimestamp(messageElement) {
        let metaDiv = messageElement.querySelector('.message-meta');
        if (!metaDiv) {
            metaDiv = document.createElement('div');
            metaDiv.classList.add('message-meta');
            messageElement.appendChild(metaDiv);
        }

        const timestampSpan = document.createElement('span');
        const currentTime = formatTime(new Date());
        timestampSpan.textContent = currentTime;

        if (messageElement.classList.contains('bot-message') && !messageElement.classList.contains('error-message')) {
            metaDiv.insertBefore(timestampSpan, metaDiv.firstChild);
        } else {
            metaDiv.appendChild(timestampSpan);
        }
        return currentTime;
    }

    function addTimestampFromText(messageElement, timestampText) {
        let metaDiv = messageElement.querySelector('.message-meta');
        if (!metaDiv) {
            metaDiv = document.createElement('div');
            metaDiv.classList.add('message-meta');
            messageElement.appendChild(metaDiv);
        }
        const timestampSpan = document.createElement('span');
        timestampSpan.textContent = timestampText;

        if (messageElement.classList.contains('bot-message') && !messageElement.classList.contains('error-message')) {
            metaDiv.insertBefore(timestampSpan, metaDiv.firstChild);
        } else {
            metaDiv.appendChild(timestampSpan);
        }
    }

    function addCopyButton(messageElement, textToCopy) {
        let metaDiv = messageElement.querySelector('.message-meta');
        if (!metaDiv) {
            metaDiv = document.createElement('div');
            metaDiv.classList.add('message-meta');
            messageElement.appendChild(metaDiv);
        }

        const copyBtn = document.createElement('button');
        copyBtn.classList.add('copy-button');
        copyBtn.innerHTML = '⎘'; // Kopi-ikon
        copyBtn.title = 'Kopier melding';

        copyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(textToCopy).then(() => {
                copyBtn.innerHTML = '✓'; // Sjekkmerke
                copyBtn.title = 'Kopiert!';
                setTimeout(() => {
                    copyBtn.innerHTML = '⎘';
                    copyBtn.title = 'Kopier melding';
                }, 2000);
            }).catch(err => {
                console.error('Kunne ikke kopiere tekst: ', err);
                copyBtn.textContent = 'Feil';
                 setTimeout(() => {
                    copyBtn.innerHTML = '⎘';
                    copyBtn.title = 'Kopier melding';
                }, 2000);
            });
        });
        // Plasserer kopier-knappen etter tidstempel hvis begge er der
        if (metaDiv.lastChild && metaDiv.lastChild.tagName === 'SPAN') {
             metaDiv.appendChild(copyBtn);
        } else {
            metaDiv.insertBefore(copyBtn, metaDiv.firstChild);
        }
    }

    // Funksjon for enkel Markdown-rendering
    function renderSimpleMarkdown(text) {
        if (typeof text !== 'string') return '';
        let html = text;
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
        html = html.replace(/\n/g, '<br>');
        return html;
    }

    function addMessageToChat(message, sender, type = '') {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');

        if (type === 'error') {
            messageElement.classList.add('error-message');
        } else {
            messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
        }

        const pElement = document.createElement('p');
        if (sender === 'bot' && type !== 'error') {
            pElement.innerHTML = renderSimpleMarkdown(message);
        } else {
            pElement.textContent = message;
        }
        messageElement.appendChild(pElement);

        return messageElement;
    }

    function showThinkingIndicator() {
        const thinkingElement = document.createElement('div');
        thinkingElement.classList.add('message', 'bot-message', 'thinking'); // 'thinking' klasse for egen styling
        thinkingElement.id = 'thinking-indicator';

        const pElement = document.createElement('p');
        pElement.textContent = "Tenker...";
        thinkingElement.appendChild(pElement);
        // addTimestamp(thinkingElement); // Vurder om tenke-indikator trenger tidstempel

        chatWindow.appendChild(thinkingElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function removeThinkingIndicator() {
        const thinkingIndicator = document.getElementById('thinking-indicator');
        if (thinkingIndicator) {
            thinkingIndicator.remove();
        }
    }

    // --- CHAT HISTORIKK (LocalStorage) ---
    const CHAT_HISTORY_KEY = 'gullaksenChatHistory_v2_dark'; // Endret nøkkel for å unngå konflikt med gammel historikk

    function saveMessageToHistory(messageObject) {
        const history = getChatHistory();
        history.push(messageObject);
        try {
            localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
        } catch (e) {
            console.error("Feil ved lagring til localStorage (muligens full?):", e);
        }
    }

    function getChatHistory() {
        const historyJSON = localStorage.getItem(CHAT_HISTORY_KEY);
        try {
            return historyJSON ? JSON.parse(historyJSON) : [];
        } catch (e) {
            console.error("Feil ved parsing av historikk fra localStorage:", e);
            localStorage.removeItem(CHAT_HISTORY_KEY);
            return [];
        }
    }

    function clearChatHistory() {
        localStorage.removeItem(CHAT_HISTORY_KEY);
    }

    function displayMessageFromHistory(messageObject) {
        const messageElement = addMessageToChat(messageObject.text, messageObject.sender, messageObject.type || '');
        addTimestampFromText(messageElement, messageObject.timestamp);

        if (messageObject.sender === 'bot' && (!messageObject.type || messageObject.type !== 'error')) {
            addCopyButton(messageElement, messageObject.text);
        }
        chatWindow.appendChild(messageElement);
    }

    function loadChatHistory() {
        chatWindow.innerHTML = '';
        const history = getChatHistory();

        if (history.length === 0) {
            const welcomeText = "Hei! Hvordan kan jeg hjelpe deg i dag?\nDu kan bruke **fet skrift** eller *kursiv* i svarene jeg gir.";
            const welcomeMessageElement = addMessageToChat(welcomeText, 'bot');
            const currentTime = formatTime(new Date());
            addTimestampFromText(welcomeMessageElement, currentTime);
            addCopyButton(welcomeMessageElement, welcomeText);
            // saveMessageToHistory({ text: welcomeText, sender: 'bot', timestamp: currentTime, type: '' }); // Valgfritt å lagre velkomst
            chatWindow.appendChild(welcomeMessageElement);
        } else {
            history.forEach(displayMessageFromHistory);
        }
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    async function sendMessage() {
        const messageText = userInput.value.trim();
        if (messageText === '') return;

        const userMessageElement = addMessageToChat(messageText, 'user');
        const userTimestamp = addTimestamp(userMessageElement);
        chatWindow.appendChild(userMessageElement);
        saveMessageToHistory({ text: messageText, sender: 'user', timestamp: userTimestamp, type: '' });

        userInput.value = '';
        showThinkingIndicator();

        try {
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageText }),
            });

            removeThinkingIndicator();
            let replyText;
            let messageType = '';

            if (!response.ok) {
                let errorData = { reply: `Feil: ${response.status} ${response.statusText}`};
                try { errorData = await response.json(); } catch (e) { /* Ignorer */ }
                replyText = errorData.reply || errorData.error || `Serverfeil: ${response.status}`;
                messageType = 'error';
                console.error('Serverfeil:', response);
            } else {
                const data = await response.json();
                if (data.reply) {
                    replyText = data.reply;
                } else if (data.error) {
                    replyText = `Feil fra bot: ${data.error}`;
                    messageType = 'error';
                } else {
                    replyText = "Fikk et uventet svar fra boten.";
                    messageType = 'error';
                }
            }

            const botMessageElement = addMessageToChat(replyText, 'bot', messageType);
            const botTimestamp = addTimestamp(botMessageElement);
            if (messageType !== 'error') {
                addCopyButton(botMessageElement, replyText);

                // *** NY KODE for dynamisk effekt på bot-svar ***
                botMessageElement.classList.add('bot-reply-indicator');
                setTimeout(() => {
                    // Fjerner klassen slik at animasjonen kan kjøre igjen neste gang
                    if (botMessageElement) { // Dobbeltsjekk at elementet fortsatt finnes
                        botMessageElement.classList.remove('bot-reply-indicator');
                    }
                }, 1200); // Varighet på animasjonen i ms (match CSS: 1.2s = 1200ms)
                // *** SLUTT PÅ NY KODE ***
            }
            chatWindow.appendChild(botMessageElement);
            saveMessageToHistory({ text: replyText, sender: 'bot', timestamp: botTimestamp, type: messageType });

        } catch (error) {
            removeThinkingIndicator();
            const errorText = 'Kunne ikke koble til chatbot-serveren. Sjekk at serveren kjører og at backendUrl er riktig.';
            const errorMsgElement = addMessageToChat(errorText, 'bot', 'error');
            const errorTimestamp = addTimestamp(errorMsgElement);
            chatWindow.appendChild(errorMsgElement);
            saveMessageToHistory({ text: errorText, sender: 'bot', timestamp: errorTimestamp, type: 'error' });
            console.error('Nettverksfeil eller feil ved sending/mottak:', error);
        }
        // Sikrer at vi scroller helt ned etter at alle elementer (inkl. de med animasjon) er lagt til
        requestAnimationFrame(() => {
            chatWindow.scrollTop = chatWindow.scrollHeight;
        });
    }

    // --- EVENT LISTENERS ---
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
    if (userInput) {
        userInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) { // Legg til !event.shiftKey hvis du vil tillate linjeskift med Shift+Enter
                event.preventDefault(); // Forhindrer standard Enter-oppførsel i tekstfelt (f.eks. linjeskift)
                sendMessage();
            }
        });
    }

    if (clearChatButton) {
        clearChatButton.addEventListener('click', () => {
            if (confirm("Er du sikker på at du vil slette chatloggen?")) { // Legger til en bekreftelsesdialog
                clearChatHistory();
                loadChatHistory();
            }
        });
    }

    // --- INITIALISERING ---
    loadChatHistory(); // Laster historikk og viser velkomstmelding hvis ingen historikk
});
