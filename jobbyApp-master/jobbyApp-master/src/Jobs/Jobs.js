import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header/Header'
import JobCard from '../JobCard/JobCard'
import FilterGroup from '../FilterGroup/FilterGroup'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const profileApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const jobsApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileDetails: {},
    jobDetails: [],
    searchInput: '',
    ActiveSalaryRange: '',
    employeeTypeList: [],
    profileApiStatus: profileApiStatusConstants.initial,
    jobsApiStatus: jobsApiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfile()
    this.getJobsDetails()
  }

  getJobsDetails = async () => {
    this.setState({jobsApiStatus: jobsApiStatusConstants.inProgress})
    const {searchInput, ActiveSalaryRange, employeeTypeList} = this.state
    const employmentString = employeeTypeList.join()
    console.log(employeeTypeList)
    console.log(employmentString)
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentString}&minimum_package=${ActiveSalaryRange}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.jobs.map(eachJob => ({
        id: eachJob.id,
        title: eachJob.title,
        location: eachJob.location,
        rating: eachJob.rating,
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        packagePerAnnum: eachJob.package_per_annum,
      }))
      this.setState({
        jobDetails: updatedData,
        jobsApiStatus: jobsApiStatusConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: jobsApiStatusConstants.failure})
    }
  }

  getProfile = async () => {
    this.setState({profileApiStatus: profileApiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const UpdatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileDetails: UpdatedData,
        profileApiStatus: profileApiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: profileApiStatusConstants.failure})
    }
  }

  onSearchInputChange = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterButtonClicked = event => {
    if (event.key === 'Enter') {
      this.getJobsDetails()
    }
  }

  onClickSearchInput = () => {
    this.getJobsDetails()
  }

  //   onClickRetryButton = () => {
  //     this.getJobsDetails()
  //   }

  //   onClickProfileRetryButton = () => {
  //     this.getProfile()
  //   }

  onChangeSalaryRange = id => {
    this.setState({ActiveSalaryRange: id}, this.getJobsDetails)
  }

  onEmploymentUpdate = type => {
    const {employeeTypeList} = this.state

    const inputNotInList = employeeTypeList.filter(
      eachItem => eachItem === type,
    )
    // console.log(inputNotInList)
    if (inputNotInList.length === 0) {
      this.setState(
        prevState => ({
          employeeTypeList: [...prevState.employeeTypeList, type],
        }),
        this.getJobsDetails,
      )
    } else {
      const filteredData = employeeTypeList.filter(
        eachItem => eachItem !== type,
      )
      // console.log(filteredData)

      this.setState({employeeTypeList: filteredData}, this.getJobs)
    }
  }

  renderProfileDetails = () => {
    const {profileDetails} = this.state
    const {name, shortBio, profileImageUrl} = profileDetails
    return (
      <div className="profile-card">
        <img src={profileImageUrl} alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  renderProfileFailureView = () => (
    <div className="profileButton-Container">
      <button type="button" onClick={this.getProfile} className="button">
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobDetailsView = () => {
    const {jobDetails} = this.state
    if (jobDetails.length > 0) {
      return (
        <ul className="jobsList-container">
          {jobDetails.map(eachJob => (
            <JobCard key={eachJob.id} data={eachJob} />
          ))}
        </ul>
      )
    }
    return (
      <div className="noJob-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-job-image"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters</p>
      </div>
    )
  }

  renderJobDetailsFailureView = () => (
    <div className="failureView-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png "
        alt="failure view"
        className="failure-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.getJobsDetails} className="button">
        Retry
      </button>
    </div>
  )

  renderJobView = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case jobsApiStatusConstants.success:
        return this.renderJobDetailsView()
      case jobsApiStatusConstants.inProgress:
        return this.renderLoadingView()
      case jobsApiStatusConstants.failure:
        return this.renderJobDetailsFailureView()
      default:
        return null
    }
  }

  renderProfileView = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case profileApiStatusConstants.success:
        return this.renderProfileDetails()
      case profileApiStatusConstants.inProgress:
        return this.renderLoadingView()
      case profileApiStatusConstants.failure:
        return this.renderProfileFailureView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <div className="jobsRoute-container">
        <Header />
        <div className="filter-and-jobs-container">
          <div className="profile-and-filter-container">
            {this.renderProfileView()}
            <FilterGroup
              salaryRangesList={salaryRangesList}
              onChangeSalaryRange={this.onChangeSalaryRange}
              employmentTypesList={employmentTypesList}
              onEmploymentUpdate={this.onEmploymentUpdate}
            />
          </div>
          <div className="jobs-container">
            <div className="search-container">
              <input
                type="search"
                placeholder="Search"
                className="search"
                onChange={this.onSearchInputChange}
                onKeyDown={this.onEnterButtonClicked}
                value={searchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="searchButton-container"
                onClick={this.onClickSearchInput}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobView()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
