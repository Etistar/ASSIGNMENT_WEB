import Project from '../models/project.model.js'
import Qualification from '../models/qualification.model.js'
import { projects, qualifications } from './portfolioData.js'

const seedPortfolio = async () => {
  const projectCount = await Project.countDocuments()
  if (projectCount === 0) {
    await Project.insertMany(projects)
    console.log(`Seeded ${projects.length} projects.`)
  }

  const qualificationCount = await Qualification.countDocuments()
  if (qualificationCount === 0) {
    await Qualification.insertMany(qualifications)
    console.log(`Seeded ${qualifications.length} qualifications.`)
  }
}

export default seedPortfolio
