schema
{
type: 'create' | 'join' | 'update' | 'delete'
category: 'stopwatch' | 'timer'
state: <sm data>
}

XXX: notif on opening view only klocs with option to dismiss and don't show again
XXX: test view-only state sharing

XXX: disable switch until connected
XXX: fix/account for local date/time drift on different devices
XXX: fullscreen
XXX: scroll on tabs with use-gesture
XXX: mute button in header for timer
XXX: notification permission ux (bell icon button in header with switch in popover?)
XXX: schedule timer notification in service worker
XXX: handle firefox requireInteraction support under flag
XXX: title and description for shared timer and stopwatch

XXX: ?: ability to create room with custom id
XXX: notif on disconnect
XXX: test disconnect

XXX: your timer ended while you were away toast + handle beep play without interaction (or) ?: use alert dialog instead
XXX: test new toast

XXX: buttons stop using scale by default and scale up on hover and scale down on active but keep font unscaled? (see Josh Comeau's article on CSS Transitions for exact button animation)

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

XXX: timer & stopwatch timeView days, years : show units when hours is present
XXX: timer & stopwatch timeView days, years : units styling
XXX: timer & stopwatch timeView days, years : do not show units with 0 value when hours is present
XXX: timer & stopwatch timeView days, years : do not prefix 0 on the biggest unit when hours is present
XXX: timer & stopwatch timeView days, years : hours, days, years layout
XXX: add days, years timer & stopwatch tests

XXX: kloc.live domain

XXX: animate timer buttons
XXX: animate with morphing icons (lottie?)
XXX: ?: pwa or capacitor app with timer notifications, open app via link, convert local and session storage stuff, link for share using android share, fullscreen
XXX: update Readme with capacitor stuff

XXX: ?: negative timer in toast description (upto seconds only)

XXX: ?: lazy load pages
XXX: ?: test pages are loaded properly

XXX: ?: countdown animation for timeView (except ms)
XXX: ?: 3 body problem easter egg in timer timeview
XXX: ?: electron app with timer notifications

XXX: Deadpool 3 timer and linkedin/reactiflux discord post
XXX: ?: blog post on dev.to
