import jsQR from 'jsqr'
import { PNG } from 'pngjs'

describe('State sharing', () => {
  let switchOnSfx: HTMLAudioElement
  let switchOffSfx: HTMLAudioElement
  let notificationSfx: HTMLAudioElement

  const stubAudio = (win) => {
    const Audio = win.Audio
    cy.stub(win, 'Audio').callsFake((src) => {
      const audio = new Audio(src)
      switch (src.replaceAll(/\/sounds\/|.mp3/g, '')) {
        case 'switch-on':
          switchOnSfx = audio
          break
        case 'switch-off':
          switchOffSfx = audio
          break
        case 'notification':
          notificationSfx = audio
          break
      }

      return audio
    })
  }

  beforeEach(() => {
    cy.visit('/', { onBeforeLoad: stubAudio })
  })

  it('create room, share link, and delete room', () => {
    cy.get('[data-cy="share"]').click()
    cy.get('[data-cy="share-switch"]')
      .should('have.attr', 'data-state')
      .and('match', /^unchecked$/)
    cy.get('[data-cy="share-link"]').should('not.exist')
    cy.get('[data-cy="exit-session-button"]').should('not.exist')

    expect(switchOnSfx.played).to.have.property('length').to.equal(0)
    cy.get('[data-cy="share-switch"]')
      .then(($switch) => {
        cy.wrap($switch).click()
      })
      .then(() => {
        cy.get('[data-cy="share-switch"]')
          .should('have.attr', 'data-state')
          .and('match', /^checked$/)
        expect(switchOnSfx.played).to.have.property('length').to.equal(1)
      })

    cy.location().then((location) => {
      cy.get('[data-cy="share-link"]').should('exist').contains(location.href)
    })
    cy.get('[data-cy="exit-session-button"]').should('exist')

    cy.get('[data-cy="clipboard-icon"]').should('exist')
    cy.get('[data-cy="share-link"]').trigger('mouseover')
    cy.get('[data-cy="copy"]')
      .then(($btn) => {
        cy.wrap($btn).focus()
        cy.wrap($btn).realClick()
      })
      .then(() => {
        cy.get('[data-cy="check-icon"]').should('exist')
      })

    cy.window().then((window) => {
      window.navigator.clipboard.readText().then((copiedUrl) => {
        expect(copiedUrl).to.equal(window.location.href)
      })
    })

    cy.get('[data-cy="qr-code"]').should('not.exist')
    cy.get('[data-cy="qr-code-button"]').click()
    cy.get('[data-cy="qr-code"]').should('exist')
    cy.get('[data-cy="qr-code"]').screenshot('qr-code', {
      overwrite: true,
      onAfterScreenshot($el, props) {
        cy.readFile(props.path, null).then((rawData) => {
          const png = PNG.sync.read(rawData)
          const { data: qrCodeData } = jsQR(
            new Uint8ClampedArray(png.data),
            png.width,
            png.height,
          )
          cy.location().then((location) => {
            expect(qrCodeData).to.equal(location.href)
          })
        })
      },
    })

    cy.location().then((location) => {
      const roomId = location.pathname.split('/')[2]

      cy.joinRoom(roomId)
        .then((result) => {
          cy.fixture('joinRoomSuccessResult').should(
            'deep.equal',
            JSON.parse(result),
          )
        })
        .then(() => {
          expect(switchOffSfx.played).to.have.property('length').to.equal(0)
          cy.get('[data-cy="share-switch"]')
            .then(($switch) => {
              cy.wrap($switch).click()
            })
            .then(() => {
              expect(switchOffSfx.played).to.have.property('length').to.equal(1)

              cy.get('[data-cy="share-link"]').should('not.exist')
              cy.get('[data-cy="exit-session-button"]').should('not.exist')
              cy.get('[data-cy="qr-code"]').should('not.exist')

              cy.joinRoom(roomId).then((result) => {
                cy.fixture('joinRoom404Result').should(
                  'deep.equal',
                  JSON.parse(result),
                )
              })
            })
        })
    })
  })

  it('join room, update room, and get notification & reset machine on room delete', () => {
    cy.deleteRoom('foo')
    cy.createRoom('foo')
    cy.visit('/kloc/foo', { onBeforeLoad: stubAudio })
    cy.get('[data-cy="network-status"]').should('exist')
    cy.get('[data-cy="share"]').click()
    cy.get('[data-cy="share-switch"]')
      .should('have.attr', 'data-state')
      .and('match', /^checked$/)

    cy.createRoom('foo').then((result) => {
      cy.fixture('createRoom409Result').should('deep.equal', JSON.parse(result))
    })

    // update from client to server
    cy.get('[data-cy="stopwatch-trigger"]').click()
    cy.get('[data-cy="start"]').click()
    cy.getAllSessionStorage().then((sessionStorage) => {
      let joinRoomResult
      cy.joinRoom('foo')
        .then((result) => {
          joinRoomResult = JSON.parse(result)
          cy.fixture('joinRoomSuccessResult').then((joinRoomSuccessResult) => {
            joinRoomSuccessResult.stopwatch = JSON.parse(
              sessionStorage[Cypress.env('baseUrl')].stopwatch as string,
            )
            expect(joinRoomResult).to.deep.equal(joinRoomSuccessResult)
          })
        })
        .then(() => {
          // update from server to client
          joinRoomResult.stopwatch.context.elapsed = 150
          joinRoomResult.stopwatch.value = 'paused'
          cy.updateRoom('foo', joinRoomResult)
          cy.get('[data-cy="resume"]').should('be.visible')
          cy.get('[data-cy="elapsed"]').contains('00 : 00 . 15')
        })
        .then(() => {
          cy.get('[data-cy="share"]').click()
          cy.deleteRoom('foo')
          cy.location('pathname').should('not.contain', 'foo')
          cy.get('[data-cy="network-status"]').should('not.exist')
          cy.get('[data-cy="share-switch"]')
            .should('have.attr', 'data-state')
            .and('match', /^unchecked$/)
          expect(notificationSfx.played).to.have.property('length').to.equal(0)
          cy.get('[data-cy="toast"]')
            .should('exist')
            .contains('Kloc foo was deleted')
            .then(() => {
              expect(notificationSfx.played)
                .to.have.property('length')
                .to.equal(1)
            })

          cy.get('[data-cy="start"]').should('be.visible')
          cy.get('[data-cy="elapsed"]').contains('00 : 00 . 00')
        })
    })
  })

  it('exit session in desktop', () => {
    cy.testExitSession()
  })

  it('exit session in mobile', () => {
    cy.viewport('iphone-se2')
    cy.testExitSession()
  })
})

// XXX: 404
// XXX: 409
// XXX: network status - connected, offline and disconnected
