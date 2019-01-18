import { FunctionalComponent, h } from 'preact'

export interface ISpinnerProps {
  text?: string
}

export const Spinner: FunctionalComponent<ISpinnerProps> = ({ text }) => (
  <div class='loading'>
    {text}
  </div>
)
