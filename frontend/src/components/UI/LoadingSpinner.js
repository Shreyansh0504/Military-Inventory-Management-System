import "./LoadingSpinner.css"

const LoadingSpinner = ({ size = "medium" }) => {
  return (
    <div className={`spinner-container ${size}`}>
      <div className="spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
    </div>
  )
}

export default LoadingSpinner
