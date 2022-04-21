class SiteTopicDisplay {
    constructor(options) {
        this.options = options
        this.Visible = false
        this.CurrentTopicIndex = -1
        this.elements = { TopicBackground: null, TopicString: null, }
        this.content = this.generateContent()
    }

    generateContent() {
        //  Create the main container and the centered header box
        let container = Container.create({ id: "SiteTopicDisplay", style: {}, })
        this.elements.TopicBackground = Container.create({
            id: "TopicBackground",
            style: {
                position: "absolute",
                top: "90%",
                width: "100%",
                height: "10%",
                overflow: "hidden",
                display: "none",
                backgroundColor: SETTINGS.DISPLAY.BACKGROUND_COLOR
            },
        })
        container.appendChild(this.elements.TopicBackground)

        this.elements.TopicString = Label.create({
            id: "TopicString",
            style: {
                fontFamily: SETTINGS.DISPLAY.TOPIC_TEXT_FONT,
                fontSize: SETTINGS.DISPLAY.TOPIC_TEXT_SIZE,
                color: SETTINGS.DISPLAY.TOPIC_TEXT_COLOR,
                position: "relative",
                left: SETTINGS.DISPLAY.TOPIC_TEXT_LEFT_BUFFER,
                top: SETTINGS.DISPLAY.TOPIC_TEXT_TOP_BUFFER
            }
        })
        this.elements.TopicBackground.appendChild(this.elements.TopicString)

        this.setOnChatMessage()

        return container
    }

    setOnChatMessage() {
        TwitchController.AddTwitchMessageCallback("PRIVMSG", (message) => {
            if (message.username !== channel) return
            let messageLower = message.message.toLowerCase()
            
            //  Print out the message to show we've received it
            console.log("PRIVMSG: ", message)

            var mainCommand = "!topic"
            var messageParts = messageLower.split(' ')
            if ((messageParts[0] === mainCommand) && (messageParts.length > 1)) {
                var topicIndex = parseInt(messageParts[1])
                if (messageParts[1] === topicIndex.toString()) {
                    if (topicIndex > 0 && topicIndex <= SETTINGS.DISPLAY.TOPIC_LIST.length) {
                        if(!this.Visible) this.show(true)
                        this.setTopicString(topicIndex - 1)
                    }
                    else { this.show(false) }
                }
            }
        });
    }

    setTopicString(topicIndex) {
        this.CurrentTopicIndex = topicIndex
        if (this.CurrentTopicIndex >= 0) this.elements.TopicString.setValue(SETTINGS.DISPLAY.TOPIC_LIST[this.CurrentTopicIndex])
    }

    show(show) {
        this.elements.TopicBackground.style.display = show ? "block" : "none"
        this.setTopicString(show ? 0 : -1)
        this.Visible = show
    }
}