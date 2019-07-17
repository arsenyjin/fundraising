import React from 'react'
import PropTypes from 'prop-types'
import iconSize from '../icon-size'

const IconSearch = ({ size, ...props }) => {
  const sizeValue = iconSize(size)
  return (
    <svg
      width={sizeValue}
      height={sizeValue}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M15.565 5.984A6.73 6.73 0 0 0 10.775 4a6.73 6.73 0 0 0-4.79 1.984A6.73 6.73 0 0 0 4 10.774a6.73 6.73 0 0 0 1.984 4.79 6.73 6.73 0 0 0 4.79 1.985 6.73 6.73 0 0 0 4.79-1.984 6.73 6.73 0 0 0 1.985-4.79 6.73 6.73 0 0 0-1.984-4.79zm-4.79 10.272a5.488 5.488 0 0 1-5.482-5.482 5.488 5.488 0 0 1 5.481-5.481 5.488 5.488 0 0 1 5.482 5.481 5.488 5.488 0 0 1-5.482 5.482z"
      />
      <path
        fill="currentColor"
        d="M19.81 18.896l-4.248-4.248a.646.646 0 1 0-.914.914l4.249 4.249a.644.644 0 0 0 .914 0 .646.646 0 0 0 0-.915z"
      />
    </svg>
  )
}

IconSearch.propTypes = {
  size: PropTypes.oneOf(['medium', 'small', 'tiny']),
}
export default IconSearch
