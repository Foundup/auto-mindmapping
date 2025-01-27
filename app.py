import streamlit as st
import openai
import os

# Configure the page
st.set_page_config(
    page_title="Foundups AI Mind Map",
    page_icon="🧠",
    layout="wide"
)

# Initialize OpenAI API key
openai.api_key = st.secrets.get("OPENAI_API_KEY", os.getenv("OPENAI_API_KEY"))

# Templates
TEMPLATES = {
    "BRAINSTORM": {
        "name": "Brainstorming",
        "prompt": "Create a detailed mind map for brainstorming ideas about: ",
        "style": "creative and expansive"
    },
    "PLANNING": {
        "name": "Project Planning",
        "prompt": "Create a structured mind map for planning all aspects of: ",
        "style": "organized and hierarchical"
    },
    "ANALYSIS": {
        "name": "Problem Analysis",
        "prompt": "Create an analytical mind map to break down and solve: ",
        "style": "logical and systematic"
    }
}

# Title and description
st.title("Foundups AI Mind Mapping Tool")
st.write("Welcome to the Foundups AI-powered Mind Mapping tool for launching Foundups!")
st.write("""
A Foundup is an AI-managed tokenized idea for solving a problem that evolves from a Decentralized Autonomous Entity (DAE) into a smartDAO.
""")

# Sidebar for settings
with st.sidebar:
    st.header("Settings")
    template = st.selectbox(
        "Template",
        options=list(TEMPLATES.keys()),
        format_func=lambda x: TEMPLATES[x]["name"]
    )
    
    temperature = st.slider(
        "Temperature",
        min_value=0.0,
        max_value=1.0,
        value=0.7,
        step=0.1,
        help="Higher values make the output more creative but less focused"
    )

# Main input section
col1, col2 = st.columns(2)

with col1:
    problem = st.text_area("Enter the problem you want to solve:", height=100)
    
with col2:
    solution = st.text_area("What is the solution to the problem?", height=100)

outcome = st.text_area("What is the desired outcome?", height=100)

# Generate button
if st.button("Generate Mind Map", type="primary", disabled=not all([problem, solution, outcome])):
    with st.spinner("Generating your mind map..."):
        try:
            # Construct the prompt
            full_prompt = f"{TEMPLATES[template]['prompt']}{problem}\n\nSolution: {solution}\n\nDesired Outcome: {outcome}\n\nStyle: {TEMPLATES[template]['style']}"
            
            # Call OpenAI API
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a mind mapping expert. Create a detailed mind map structure in Mermaid.js format."},
                    {"role": "user", "content": full_prompt}
                ],
                temperature=temperature
            )
            
            # Extract the mind map text
            mind_map_text = response.choices[0].message.content
            
            # Display results
            st.subheader("Generated Mind Map")
            st.code(mind_map_text, language="mermaid")
            
            # Summary section
            st.subheader("Summary of your Foundup")
            st.write(f"**Problem:** {problem}")
            st.write(f"**Solution:** {solution}")
            st.write(f"**Outcome:** {outcome}")
            
        except Exception as e:
            st.error(f"Error generating mind map: {str(e)}")

# Help section
with st.expander("How to use this tool"):
    st.write("""
    1. Select a template type from the sidebar
    2. Enter your problem, solution, and desired outcome
    3. Adjust the temperature setting if needed (higher = more creative)
    4. Click 'Generate Mind Map' to create your visualization
    5. The mind map will be displayed in Mermaid.js format
    6. You can copy the generated code or view the rendered mind map
    """)

# Footer
st.markdown("---")
st.markdown("Powered by Foundups® - Building the future of decentralized innovation") 