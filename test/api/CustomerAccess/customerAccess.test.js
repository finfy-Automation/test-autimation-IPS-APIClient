require('dotenv').config()
const superTest = require('supertest')
const Joi = require('joi')
const schema = require('./customerAccess.schema')
const baseUrl = process.env.BASEURL
const clientId = process.env.CLIENTID
const clientSecret = process.env.CLIENTSECRET

describe('POST - Customer Access (Login)', () => {
  test('T01 - Successfull - Should return status 201 and an object containing token and expiresIn.', async () => {
    // Arrange
    // Act
    const response = await superTest(baseUrl)
      .post('v1/account/api-client-login')
      .send({
        'clientId': clientId,
        'clientSecret': clientSecret,
      })
    process.env.JWT = response.body.token
    // Assert
    expect(response.status).toBe(201)
    expect(response.body).toBeDefined()
    Joi.assert(response.body, schema.successfull)
  })
  test('T02 - Error Credentials- Should return status 400 and an object containing Code, Message, and ShortMessage.', async () => {
    // Arrange
    // Act
    const response = await superTest(baseUrl)
      .post('v1/account/api-client-login')
      .send({
        'clientId': clientId,
        'clientSecret': 'clientSecret',
      })
    // Assert
    expect(response.status).toBe(400)
    expect(response.body).toBeDefined()
    Joi.assert(response.body, schema.errorCredentials)
  })
  test('T03 - Other Errors- Should return status 400 and an object containing Code, Message, ShortMessage, and Details explaining the error.', async () => {
    // Arrange
    // Act
    const response = await superTest(baseUrl)
      .post('v1/account/api-client-login')
      .send({
        'clientId': 'clientId',
        'clientSecret': clientSecret,
      })
    // Assert
    expect(response.status).toBe(400)
    expect(response.body).toBeDefined()
    Joi.assert(response.body, schema.otherErrors)
  })
})
describe('POST - Authorizer Validation', () => {
  test('T04 - Successfull - Should return status 200 and not return Authorization error.', async () => {
    // Arrange
    // Act
    const response = await superTest(baseUrl)
      .post('v1/auth/test')
      .set('authorization', `Bearer ${process.env.JWT}`)
    // Assert
    expect(response.status).toBe(200)
    expect(response.body).toBeDefined()
    Joi.assert(response.body, schema.authorizerValidation)
  })
  test('T05 - Not Authorized - Should return 403 status and Authorization error message.', async () => {
    // Arrange
    const jwt = 'r' + process.env.JWT.slice(1)
    // Act
    const response = await superTest(baseUrl)
      .post('v1/auth/test')
      .set('authorization', `Bearer ${jwt}`)
    // Assert
    expect(response.status).toBe(403)
    expect(response.body).toBeDefined()
    Joi.assert(response.body, schema.notAuthorized)
  })
})
