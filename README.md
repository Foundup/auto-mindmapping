# Automated Mindmapping with GPT and Mermaid

This repository houses a project that enables automatic creation of mindmaps using OpenAI's GPT-3.5-turbo and GPT-4 models, with the support of Mermaid for mindmap visualizations.

![auto-mindmapping-2](https://github.com/florian-kalisch/auto-mindmapping/assets/5501881/4921a32e-7861-476d-be00-f00cb81f12ba)


## About

The system comes with built-in system prompts for brainstorming, text summarization, and cause/effect visualization. The integration of GPT models provides the power of language understanding, while Mermaid enables rich and customizable visual representations.

What does the project say about advantages and disadvantages of automated mindmapping (note that GitHub doesn't seem to support the icons)? This is the generated mermaid code (available under Output):

```mermaid
mindmap
	root("Automated Mind Mapping using Large Language Models")
		["Advantages"]
		::icon(fa fa-thumbs-up)
			("Efficient and time-saving")
			::icon(fa fa-clock)
			("Easily customizable and adaptable")
			::icon(fa fa-cogs)
			("Improved collaboration and communication")
			::icon(fa fa-users)
			("Supports creative thinking and idea generation")
			::icon(fa fa-lightbulb)
			("Accessible and shareable")
			::icon(fa fa-share-alt)
			("Scalable for large data sets")
			::icon(fa fa-expand-arrows-alt)
			("Minimizes human error")
			::icon(fa fa-exclamation-triangle)
			("Integrates with other tools and platforms")
			::icon(fa fa-link)
		["Disadvantages"]
		::icon(fa fa-thumbs-down)
			("Requires reliable and accurate data")
			::icon(fa fa-database)
			("Potential for privacy and security concerns")
			::icon(fa fa-shield-alt)
			("Dependent on quality of language model")
			::icon(fa fa-brain)
			("May not capture nuances and subtleties")
			::icon(fa fa-adjust)
			("Limited by AI understanding of context")
			::icon(fa fa-glasses)
			("Potential for bias in AI-generated content")
			::icon(fa fa-balance-scale)
			("Requires regular maintenance and updates")
			::icon(fa fa-wrench)
			("May be expensive to implement and maintain")
			::icon(fa fa-dollar-sign)
			("Lack of personal touch in content")
```

[view at mermaid.live](https://mermaid.live/edit#pako:eNqNVctu20AM_JWFTi0Q_YBvAdJDgBgommPVA7WiJNb7UJZcO26Qfy9XdprYwAY9WJD3MRwOh9RLY-OAzabxFAYPSxc6STHKl665zRI9CA5mq3tmC8tCYTKZy_MB0oT6DFMGfdkqiOOu-Vrud_JTbw97CKJ7uvrrtLrZkI3hywhmhFbm7Htu83K-0pWQ38aRLGEQAxpRyGPLsNd4_5CvUKyLdvcR4dbanJT0CqDnmFgKXkLOTriKM6PdtUPMvcMLQsDkjsZmVi3oD-j2igwDLFL-VQHjxB-B7v2S4h4LJ-egj8qRYjiz9D4HsutKDS8zpgvAx7wsMQkbm1Bv7tHITGFXalNAaUAwEwZMn8I6mmbps-uvNERmesuVZ9AQn-S6HmjByQU_C26Va4zJuNUtAwgYxnoV8HnRgC2kFA98DagmJC0BslHnQDCop1IdyTrwa-qtJFKbXtb1PghOxSdsDiSziTJjMhKj4zXnxYEocc914cLu3ex3xPB_fh_iIXwk8gOfMqk51aCO3u315uIiWY1C2euBL_L6HovbCdwq-5JoD_Z4qiIqJMmxNIXFFLheTUI3XKt_hwuGoXSSuvYpgytQcdTKnieALxOghtknoIu0t3A0IYqx2kY5oQkZlNVJe869OBTCKkUYfmtDfsR7UGuUSdUfze29yco0sShYaQdlqVcFn6WGNzlgRq4L2ROwoaDY7bmn1k4O5Uw1Z_W_5tSyNgJWSj5l7QzjVRxFKqdXAfIyFGfWgA8Jg52v1ezRaPugDrwyCqIhvzj0b6N0DaG_qpfKVEot03RRpgewu6LfonLGoGJIzHYuSrwn39w0HpMGGPQr8tIFY7pGu8nruNjo64Aj6OTtmi686lHQj8rjMdhmIynjTXPK9Y5Au9E3mxEc4-tfWGtgMg)

## Features
- Utilizes gpt-3.5-turbo, gpt-3.5-turbo-16k, gpt-4, gpt-4-turbo models for mindmap generation
- Supports prompts for brainstorming, text summarization, and cause/effect visualizations
- Outputs mindmaps in Mermaid syntax
- Provides a visual representation of mindmaps
- Offers a convenient way to save generated mindmap images

## Known Limitations
- The system may sometimes produce inaccurate information due to the current limitations of Large Language Models (LLMs).
- There might be occasional inconsistencies in style.
- Sometimes, the output isn't valid Mermaid syntax (you can then edit the mermaid code under output).
- When saving the image, the Font Awesome icons might look different from what is shown on the screen.
- Due to iOS limitations the text area elements can't be resized

## Getting Started

### Online

#### Prerequisites

Ensure you have access to OpenAI's API with models like gpt-3.5-turbo, gpt-3.5-turbo-16k, gpt-4, gpt-4-turbo.

It should be obvious, but: Using the API will result in request-based costs (it is not part of the ChatGPT / Subscription).

#### Quickstart

The fastest way would be [https://florian-kalisch.github.io/auto-mindmapping/](https://florian-kalisch.github.io/auto-mindmapping/)

### Offline

#### Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest version of [Node.js and npm](https://nodejs.org/en/download/).
- You have a recent version of [Yarn](https://classic.yarnpkg.com/en/docs/install) installed.
- Ensure you have access to OpenAI's API with models like gpt-3.5-turbo, gpt-3.5-turbo-16k, gpt-4, gpt-4-turbo.

It should be obvious, but: Using the API will result in request-based costs (it is not part of the ChatGPT / Subscription).

#### Environment Variables

The project uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```
REACT_APP_OPENAI_API_KEY=your_api_key_here
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

For development, you can also create a `.env.local` file which will take precedence over `.env` and is git-ignored by default.

#### Clone and run

To start using the project, follow these steps:

1. Clone the repository:
```shell
git clone https://github.com/florian-kalisch/auto-mindmapping.git
```

2. Navigate into the project directory:
```shell
cd auto-mindmapping
```

3. Install the required dependencies using Yarn:
```shell
yarn install
```

3. Start the React development server:
```shell
yarn start
```

Your application should be running on
[localhost:3000/auto-mindmapping](http://localhost:3000/auto-mindmapping)

## Usage

### Settings
Under the **Settings** tab you have to enter your OpenAI API token. The default model is **gpt-3.5-turbo**.

You can set **max tokens** and **temperature** based on your needs (will be saved to localStorage). For brainstorming a higher **temperature** might be good.

**Prompt Template** shows you the system prompt. You can customize it to achieve more or better results (will be saved to localStorage).

### Mindmapping
With **Prompt** you can input your request. You can ask "Brainstorming for weekend activities on a sunny weekend" and get a mindmap for this topic. You can input text and you get a mind map summarizing the text. You can ask for "Mindmap for: What are the consequences if it rains." and you see what might happen then.


Sometimes the output contains the typical GPT chatter text. In this case, Mermaid does not recognize valid syntax. To avoid this, the streamed text would need to be edited/cleaned up, or at least some post-processing would need to be done. This is currently missing. To work around this problem, you can simply try again. It might also be helpful to include "brainstorm" or "mind map" in your command prompt.


To save your result, you can either copy the mermaid code from "Output" or save the image.

## Further Reading
Please take a look at the following resources to better understand the project:
- [https://react.dev/](https://react.dev/)
- [OpenAI API](https://platform.openai.com/docs/api-reference/)
- [Mermaid Syntax](https://mermaid.js.org/syntax/mindmap.html)
