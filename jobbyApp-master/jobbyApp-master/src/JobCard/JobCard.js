import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {FaSuitcase} from 'react-icons/fa'
import './index.css'

const JobCard = props => {
  const {data} = props
  const {
    id,
    title,
    location,
    rating,
    companyLogoUrl,
    employmentType,
    jobDescription,
    packagePerAnnum,
  } = data
  return (
    <Link to={`jobs/${id}`} className="link">
      <li className="each-card">
        <div className="logo-title-rating-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div>
            <h1 className="job-title">{title}</h1>
            <div className="rating-container">
              <AiFillStar className="star-icon" />
              <p>{rating}</p>
            </div>
          </div>
        </div>

        <div className="location-and-and-salary-jobType-container">
          <div className="location-and-jobType-container">
            <div className="logo-container">
              <MdLocationOn className="icons" />
              <p>{location}</p>
            </div>
            <div className="logo-container">
              <FaSuitcase className="icons" />
              <p>{employmentType}</p>
            </div>
          </div>
          <p>{packagePerAnnum}</p>
        </div>
        <hr />
        <div>
          <h1 className="job-description">Description</h1>
          <p>{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}

export default JobCard
