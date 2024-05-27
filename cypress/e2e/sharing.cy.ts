import jsQR from 'jsqr'
import { PNG } from 'pngjs'

describe('State sharing', () => {
  let switchOnSfx: HTMLAudioElement

  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        const Audio = win.Audio
        cy.stub(win, 'Audio').callsFake((src) => {
          const temp = new Audio(src)
          if (src.includes('switch-on.mp3')) {
            switchOnSfx = temp
          }

          return temp
        })
      },
    })
  })

  it('create room and share link', () => {
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
        expect(switchOnSfx.played).to.have.property('length').to.equal(1)
      })

    cy.location().then((location) => {
      cy.get('[data-cy="share-link"]')
        .should('exist')
        .contains(location.pathname)
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
      cy.joinRoom(location.pathname.split('/')[2]).then((result) => {
        cy.fixture('newRoomJoinSuccessResult').should(
          'deep.equal',
          JSON.parse(result),
        )
      })
    })
  })
})

// XXX: join
// XXX: update
// XXX: delete
// XXX: notification sfx on room delete
// XXX: exit without deleting room confirmation all options - dialog + drawer
// XXX: 404
// XXX: 409
// XXX: network status - connected, offline and disconnected
