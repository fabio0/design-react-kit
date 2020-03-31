/* eslint react/prefer-stateless-function: 0 */

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Util } from 'reactstrap'
import iconSprite from 'bootstrap-italia/dist/svg/sprite.svg'

const { mapToCssModules, deprecated, warnOnce } = Util

const propTypes = {
  children: PropTypes.node,
  type: PropTypes.string,
  size: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  infoText: PropTypes.string,
  normalized: PropTypes.bool,
  bsSize: PropTypes.string,
  state: deprecated(
    PropTypes.string,
    'Please use the props "valid" and "invalid" to indicate the state.'
  ),
  valid: PropTypes.bool,
  invalid: PropTypes.bool,
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  innerRef: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
    PropTypes.string
  ]),
  static: deprecated(PropTypes.bool, 'Please use the prop "plaintext"'),
  plaintext: PropTypes.bool,
  addon: PropTypes.bool,
  className: PropTypes.string,
  cssModule: PropTypes.object
}

const defaultProps = {
  type: 'text'
}

class Input extends React.Component {
  constructor() {
    super()
    this.state = {
      isFocused: false,
      hidden: true,
      icon: true
    }
    this.toggleShow = this.toggleShow.bind(this)
  }

  toggleFocusLabel = () => {
    this.setState({
      isFocused: true
    })
  }

  toggleBlurLabel = e => {
    if (e.target.value === '') {
      this.setState({
        isFocused: !this.state.isFocused
      })
    }
  }

  toggleShow() {
    this.setState({ hidden: !this.state.hidden, icon: !this.state.icon })
  }

  render() {
    const {
      className,
      cssModule,
      type,
      state,
      tag,
      addon,
      static: staticInput,
      plaintext,
      innerRef,
      label,
      infoText,
      placeholder,
      normalized,
      value,
      ...attributes
    } = this.props
    let { bsSize, valid, invalid } = this.props

    const checkInput = ['radio', 'checkbox'].indexOf(type) > -1
    const isNotaNumber = new RegExp('\\D', 'g')

    const fileInput = type === 'file'
    const textareaInput = type === 'textarea'
    const selectInput = type === 'select'
    let Tag = tag || (selectInput || textareaInput ? type : 'input')

    let formControlClass = 'form-control'
    let infoTextControlClass = 'form-text text-muted'

    if (plaintext || staticInput) {
      formControlClass = `${formControlClass}-plaintext`
      Tag = tag || 'p'
    } else if (fileInput) {
      formControlClass = `${formControlClass}-file`
    } else if (checkInput) {
      if (addon) {
        formControlClass = null
      }
      /* Causes a regression with `bootstrap-italia`
            else {
                formControlClass = 'form-check-input';
            }
            */
    }
    if (valid || invalid) {
      infoTextControlClass = null
    }

    if (
      state &&
      typeof valid === 'undefined' &&
      typeof invalid === 'undefined'
    ) {
      if (state === 'danger') {
        invalid = true
      } else if (state === 'success') {
        valid = true
      }
    }

    if (attributes.size && isNotaNumber.test(attributes.size)) {
      warnOnce(
        'Please use the prop "bsSize" instead of the "size" to bootstrap\'s input sizing.'
      )
      bsSize = attributes.size
      delete attributes.size
    }

    const classes = mapToCssModules(
      classNames(
        className,
        invalid && 'is-invalid',
        valid && 'is-valid',
        bsSize ? `form-control-${bsSize}` : false,
        formControlClass
      ),
      cssModule
    )
    const wrapperClass = mapToCssModules(
      classNames(className, 'form-group'),
      cssModule
    )
    const infoTextClass = mapToCssModules(
      classNames(
        className,
        valid ? 'valid-feedback' : false,
        invalid ? 'invalid-feedback' : false,
        infoTextControlClass
      )
    )

    if (Tag === 'input' || typeof tag !== 'string') {
      attributes.type = type
    }

    if (
      attributes.children &&
      !(
        plaintext ||
        staticInput ||
        type === 'select' ||
        typeof Tag !== 'string' ||
        Tag === 'select'
      )
    ) {
      warnOnce(
        `Input with a type of "${type}" cannot have children. Please use "value"/"defaultValue" instead.`
      )
      delete attributes.children
    }
    if (placeholder || value) {
      return (
        <div className={wrapperClass}>
          <Tag
            {...attributes}
            ref={innerRef}
            className={classes}
            id={this.props.id}
            onFocus={this.toggleFocusLabel}
            onBlur={e => this.toggleBlurLabel(e)}
            placeholder={this.props.placeholder}
            value={this.props.value}
          />
          {
            attributes.type === 'password' ? (<span className="password-icon" aria-hidden="true">
              <svg
                className="password-icon-visible icon icon-sm"
                onClick={this.toggleShow}>
                <use
                  xlinkHref={`${iconSprite}#it-password-${
                    this.state.icon ? 'visible' : 'invisible'
                  }`}
                />
              </svg>
            </span>) : null
          }
          <label htmlFor={this.props.id} className="active">
            {this.props.label}
          </label>
          <small className={infoTextClass}>{this.props.infoText}</small>
        </div>
      )
    }
    if (attributes.type === 'password') {
      return (
        <div className={wrapperClass}>
          <Tag
            {...attributes}
            ref={innerRef}
            type={this.state.hidden ? 'password' : 'text'}
            className={
              this.state.isFocused
                ? 'form-control input-password focus--mouse'
                : 'form-control input-password'
            }
            onFocus={this.toggleFocusLabel}
            onBlur={e => this.toggleBlurLabel(e)}
            id={this.props.id}
            placeholder={this.props.placeholder}
            value={this.props.value}
          />
          <span className="password-icon" aria-hidden="true">
            <svg
              className="password-icon-visible icon icon-sm"
              onClick={this.toggleShow}>
              <use
                xlinkHref={`${iconSprite}#it-password-${
                  this.state.icon ? 'visible' : 'invisible'
                }`}
              />
            </svg>
          </span>
          <label
            htmlFor={this.props.id}
            className={this.state.isFocused ? 'active' : ''}>
            {this.props.label}
          </label>
          <small className={infoTextClass}>{this.props.infoText}</small>
        </div>
      )
    }
    if (normalized) {
      return (
        <div className={wrapperClass}>
          <Tag
            {...attributes}
            className={
              this.state.isFocused
                ? 'form-control-plaintext focus--mouse'
                : 'form-control-plaintext'
            }
            onFocus={this.toggleFocusLabel}
            onBlur={e => this.toggleBlurLabel(e)}
            id={this.props.id}
            value={this.props.value}
            readOnly
          />
          <label
            htmlFor={this.props.id}
            className={this.state.isFocused ? 'active' : ''}>
            {this.props.label}
          </label>
          <small className={infoTextClass}>{this.props.infoText}</small>
        </div>
      )
    }
    if (label || infoText) {
      return (
        <div className={wrapperClass}>
          <Tag
            {...attributes}
            ref={innerRef}
            className={classes}
            id={this.props.id}
            onFocus={this.toggleFocusLabel}
            onBlur={e => this.toggleBlurLabel(e)}
            value={this.props.value}
          />
          <label
            htmlFor={this.props.id}
            className={this.state.isFocused ? 'active' : ''}>
            {this.props.label}
          </label>
          <small className={infoTextClass}>{this.props.infoText}</small>
        </div>
      )
    }

    return <Tag {...attributes} ref={innerRef} className={classes} />
  }
}

Input.propTypes = propTypes
Input.defaultProps = defaultProps

export default Input
