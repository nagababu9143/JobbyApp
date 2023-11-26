import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {FaSuitcase} from 'react-icons/fa'
import {BiLinkExternal} from 'react-icons/bi'
import Loader from 'react-loader-spinner'
import Header from '../Header/Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobDetails extends Component {
  state = {
    specificJobDetails: {},
    similarJobDetails: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getSpecificJobDetails()
  }

  getUpdatedData = data => ({
    id: data.id,
    title: data.title,
    location: data.location,
    rating: data.rating,
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    jobDescription: data.job_description,
    packagePerAnnum: data.package_per_annum,
    lifeAtCompany: {
      description: data.life_at_company.description,
      imageUrl: data.life_at_company.image_url,
    },
    skills: data.skills.map(eachSkill => ({
      imageUrl: eachSkill.image_url,
      name: eachSkill.name,
    })),
  })

  getSimilarJobsData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    rating: data.rating,
    title: data.title,
  })

  getSpecificJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      //   console.log(data)
      const specificJobDetails = this.getUpdatedData(data.job_details)
      const similarJobDetails = data.similar_jobs.map(eachJob =>
        this.getSimilarJobsData(eachJob),
      )
      //   console.log(specificJobDetails)

      this.setState({
        specificJobDetails,
        similarJobDetails,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickRetryButton = () => {
    this.getSpecificJobDetails()
  }

  renderSuccessView = () => {
    const {specificJobDetails, similarJobDetails} = this.state
    const {
      title,
      location,
      rating,
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      packagePerAnnum,
      skills,
      lifeAtCompany,
    } = specificJobDetails
    return (
      <div className="background-container">
        <div className="jobDetails-card">
          <div className="logo-title-rating-card">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div>
              <h1 className="job-title">{title}</h1>
              <div className="rating-card">
                <AiFillStar className="star-icon" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-jobType-salary-card">
            <div className="location-jobType-card">
              <div className="location-card">
                <MdLocationOn className="location-icon" />
                <p className="location">{location}</p>
              </div>
              <div className="location-card">
                <FaSuitcase className="location-icon" />
                <p className="location">{employmentType}</p>
              </div>
            </div>
            <p className="location">{packagePerAnnum}</p>
          </div>
          <hr />
          <div>
            <div className="description-card">
              <h1>Description</h1>
              <a
                href={companyWebsiteUrl}
                className="ExternalLink-card"
                target="blank"
              >
                <BiLinkExternal className="link-icon" />
                <p className="visit">Visit</p>
              </a>
            </div>
            <p className="job-description">{jobDescription}</p>
            <h1>Skills</h1>
            <ul className="skills-container">
              {skills.map(eachSkill => (
                <li key={eachSkill.name} className="each-skill">
                  <img
                    src={eachSkill.imageUrl}
                    alt={eachSkill.name}
                    className="skillImage"
                  />
                  <p className="skillName">{eachSkill.name}</p>
                </li>
              ))}
            </ul>
            <div>
              <h1>Life at Company</h1>
              <div className="lifeAtCompany-card">
                <p>{lifeAtCompany.description}</p>
                <img
                  src={lifeAtCompany.imageUrl}
                  alt="life at company"
                  className="company-inside-image"
                />
              </div>
            </div>
          </div>
        </div>
        <h1 className="similarJobs-heading">Similar Jobs</h1>
        <ul className="similar-job-container">
          {similarJobDetails.map(eachJob => (
            <li key={eachJob.id} className="eachJob-card">
              <div className="logo-title-rating-card">
                <img
                  src={eachJob.companyLogoUrl}
                  alt="similar job company logo"
                  className="company-logo"
                />
                <div>
                  <h1 className="job-title">{eachJob.title}</h1>
                  <div className="rating-card">
                    <AiFillStar className="star-icon" />
                    <p className="rating">{eachJob.rating}</p>
                  </div>
                </div>
              </div>
              <h1>Description</h1>
              <p>{eachJob.jobDescription}</p>
              <div className="location-jobType-card">
                <div className="location-card">
                  <MdLocationOn className="location-icon" />
                  <p className="location">{eachJob.location}</p>
                </div>
                <div className="location-card">
                  <FaSuitcase className="location-icon" />
                  <p className="location">{eachJob.employmentType}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failureView-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png "
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        type="button"
        onClick={this.onClickRetryButton}
        className="button"
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="background-card">
        <Header />
        {this.renderJobDetails()}
      </div>
    )
  }
}

export default JobDetails
