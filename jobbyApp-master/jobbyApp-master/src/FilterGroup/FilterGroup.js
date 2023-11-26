import './index.css'

const FilterGroup = props => {
  const renderSalaryView = () => {
    const {salaryRangesList} = props
    return salaryRangesList.map(eachSalary => {
      const {onChangeSalaryRange} = props
      const onSalaryRangeChange = () => {
        onChangeSalaryRange(eachSalary.salaryRangeId)
      }
      return (
        <li className="each-salaryRange" key={eachSalary.salaryRangeId}>
          <input
            type="radio"
            name="salaryRange"
            id={eachSalary.salaryRangeId}
            value={eachSalary.salaryRangeId}
            onChange={onSalaryRangeChange}
          />
          <label htmlFor={eachSalary.salaryRangeId} className="label">
            {eachSalary.label}
          </label>
        </li>
      )
    })
  }

  const renderEmploymentTypeView = () => {
    const {employmentTypesList} = props
    return employmentTypesList.map(each => {
      const {onEmploymentUpdate} = props
      const onUpdateEmployment = event => {
        onEmploymentUpdate(event.target.value)
      }
      return (
        <li key={each.employmentTypeId} className="each-salaryRange">
          <input
            type="checkbox"
            id={each.employmentTypeId}
            value={each.employmentTypeId}
            onChange={onUpdateEmployment}
          />
          <label htmlFor={each.employmentTypeId} className="label">
            {each.label}
          </label>
        </li>
      )
    })
  }

  return (
    <>
      <hr />
      <h1 className="employment-heading">Type of Employment</h1>
      <ul className="salaryRange-container">{renderEmploymentTypeView()}</ul>
      <hr />
      <h1 className="employment-heading">Salary Range</h1>
      <ul className="salaryRange-container">{renderSalaryView()}</ul>
    </>
  )
}

export default FilterGroup
