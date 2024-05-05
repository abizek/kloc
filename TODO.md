schema
{
type: 'create' | 'join' | 'update' | 'delete'
category: 'stopwatch' | 'timer'
state: <sm data>
}

XXX: party provider connecting to websocket at the app level (shared room for stopwatch and timer)
XXX: on enable sharing generate new room id, update route, connect to the room and send type create with state
XXX: on routes with room id connect to the room and send type join
XXX: handle 404 room id by redirecting and showing a Toast for a short time period
XXX: on sm event changes send type update with state
XXX: listen for update messages and trigger <category>-create event
XXX: on disable sharing, disconnect room, update route and send type delete
XXX: listen for delete events, disconnect room, update route and show toast on delete
XXX: (on deletion events update route based on shared status of both stopwatch and timer)

XXX: Share menu with link icon has enable shraing switch and exit room button to exit without disabling sharing
XXX: link for share with copy, and qr code
XXX: ?: ability to create room with custom id
XXX: test state sharing
XXX: update readme app description and development instructions

XXX: view-only links
XXX: test view-only state sharing

XXX: share UI change on disconnect
XXX: notif on disconnect
XXX: test disconnect

XXX: your timer ended while you were away toast + handle beep play without interaction (or) ?: use alert dialog instead
XXX: test new toast

XXX: fullscreen
XXX: scroll on tabs with use-gesture
XXX: mute button in header for timer
XXX: title and description for shared timer and stopwatch

XXX: buttons stop using scale by default and scale up on hover and scale down on active but keep font unscaled? (see Josh Comeau's article on CSS Transitions for exact button animation)
XXX: animate timer buttons
XXX: animate with morphing icons (lottie?)

XXX: update meta title, description with each page (react-helmet maybe?)

XXX: error correction on write input
XXX: R&D: scrolling input with stiffness and damping and momentum
XXX: R&D: looping scroll input for hh mm ss
XXX: R&D: scroll on click timer input
XXX: write input on click selected values
XXX: timer input hh mm ss styling
XXX: update test for new hh mm ss scroll input

XXX: timer select date and time input + styling
XXX: update/add timer input tests

XXX: timer destination preview (no date if today, localized date if not)
XXX: update destination preview test

XXX: timer timeView days, years : show units when hours is present
XXX: timer timeView days, years : units styling
XXX: timer timeView days, years : do not show units with 0 value when hours is present
XXX: timer timeView days, years : do not prefix 0 on the biggest unit when hours is present
XXX: timer timeView days, years : hours, days, years layout
XXX: add days, years timer tests

XXX: kloc.live domain

XXX: capacitor app with timer notifications, open app via link, convert local and session storage stuff, link for share using android share
XXX: update Readme with capacitor stuff

XXX: ?: negative timer in toast description (upto seconds only)

XXX: ?: lazy load pages
XXX: ?: test pages are loaded properly

XXX: ?: countdown animation for timeView (except ms)
XXX: ?: 3 body problem easter egg in timer timeview
XXX: ?: electron app with timer notifications

XXX: Deadpool 3 timer and linkedin post
XXX: ?: blog post on dev.to
