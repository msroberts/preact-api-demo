import { render, h } from 'preact'
import App from './components/app'

// Replace the <main> element with app
render(<App/>, document.body, document.querySelector('main')!)
