import React from 'react'
import PropTypes from 'prop-types'

import generateId from './idGenerator'

const NOOP = () => {}
export default class SimpleMDEEditor extends React.Component {
  state = {
    keyChange: false,
  }

  static defaultProps = {
    onChange: NOOP,
    options: {},
    className: '',
    extraKeys: '',
    id: '',
    value: '',
    label: '',
    getMdeInstance: () => {},
    getLineAndCursor: () => {},
  }

  componentWillMount() {
    const id = this.props.id
    if (id) {
      this.id = id
    } else {
      this.id = generateId()
    }
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      this.createEditor()
      this.addEvents()
      this.addExtraKeys()
      this.getCursor()
      this.getMdeInstance()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      !this.state.keyChange &&
      nextProps &&
      nextProps.value !== this.simplemde.value()
    ) {
      this.simplemde.value((nextProps && nextProps.value) || '')
    }

    this.setState({
      keyChange: false,
    })
  }

  componentWillUnmount() {
    this.removeEvents()
  }

  createEditor = () => {
    const SimpleMDE = require('simplemde')
    const initialOptions = {
      element: document.getElementById(this.id),
      initialValue: this.props.value,
    }

    const allOptions = Object.assign({}, initialOptions, this.props.options)
    this.simplemde = new SimpleMDE(allOptions)
  }

  eventWrapper = () => {
    this.setState({
      keyChange: true,
    })
    this.props.onChange(this.simplemde.value())
  }

  removeEvents = () => {
    this.editorEl.removeEventListener('keyup', this.eventWrapper)
    if (this.editorToolbarEl) {
      this.editorToolbarEl.removeEventListener('click', this.eventWrapper)
    }
  }

  addEvents = () => {
    const wrapperId = `${this.id}-wrapper`
    const wrapperEl = document.getElementById(`${wrapperId}`)

    this.editorEl = wrapperEl.getElementsByClassName('CodeMirror')[0]
    this.editorToolbarEl = wrapperEl.getElementsByClassName('editor-toolbar')[0]

    this.editorEl.addEventListener('keyup', this.eventWrapper)
    if (this.editorToolbarEl) {
      this.editorToolbarEl.addEventListener('click', this.eventWrapper)
    }

    this.simplemde.codemirror.on('cursorActivity', this.getCursor)
  }

  getCursor = () => {
    // https://codemirror.net/doc/manual.html#api_selection
    if (this.props.getLineAndCursor) {
      this.props.getLineAndCursor(this.simplemde.codemirror.getCursor())
    }
  }

  getMdeInstance = () => {
    if (this.props.getMdeInstance) {
      this.props.getMdeInstance(this.simplemde)
    }
  }

  addExtraKeys = () => {
    // https://codemirror.net/doc/manual.html#option_extraKeys
    if (this.props.extraKeys) {
      this.simplemde.codemirror.setOption('extraKeys', this.props.extraKeys)
    }
  }

  render() {
    return (
      <div id={`${this.id}-wrapper`} className={this.props.className}>
        {this.props.label && (
          <label htmlFor={this.id}> {this.props.label} </label> // eslint-disable-line
        )}
        <textarea id={this.id} />
      </div>
    )
  }
}

SimpleMDEEditor.propTypes = {
  value: PropTypes.string,
  id: PropTypes.string,
  options: PropTypes.object,
  onChange: PropTypes.func,
  className: PropTypes.string,
  label: PropTypes.string,
  extraKeys: PropTypes.string,
  getMdeInstance: PropTypes.func,
  getLineAndCursor: PropTypes.func,
}
