<template>
    <div
        :id="card.id"
        class="card draggable"
        @mousedown="onMouseDown"
        @touchstart="onTouchStart"
        :style="{ zIndex: zIndex, left: computedLeft, top: computedTop }"
    >
        {{ card.getCardString() }}
    </div>
</template>

<script>
export default {
    name: 'Card',
    props: {
        card: {
            type: Object,
            required: true
        },
        highestZIndex: {
            type: Number,
            required: true
        },
        index: {
            type: Number
        }
    },
    data() {
        return {
            holdTimer: null,
            isDragging: false,
            zIndex: 0,
            shiftX: null,
            shiftY: null
        }
    },
    mounted() {},
    computed: {
        computedLeft() {
            return this.card.left || `${this.index * 90}px`
        },
        computedTop() {
            return this.card.top != null ? this.card.top : ''
        }
    },
    methods: {
        onMouseDown(event) {
            this.startDrag(event.clientX, event.clientY)

            document.addEventListener('mousemove', this.onMouseMove)
            document.addEventListener('mouseup', this.onMouseUp)
        },
        onMouseMove(event) {
            clearTimeout(this.holdTimer)
            this.drag(event.clientX, event.clientY)
        },
        onMouseUp() {
            clearTimeout(this.holdTimer)
            this.endDrag()
            document.removeEventListener('mousemove', this.onMouseMove)
            document.removeEventListener('mouseup', this.onMouseUp)
        },
        onTouchStart(event) {
            event.preventDefault()

            let touch = event.touches[0]
            this.startDrag(touch.clientX, touch.clientY)

            document.addEventListener('touchmove', this.onTouchMove, { passive: false })
            document.addEventListener('touchend', this.onTouchEnd)
        },
        onTouchMove(event) {
            clearTimeout(this.holdTimer)
            let touch = event.touches[0]
            this.drag(touch.clientX, touch.clientY)
        },
        onTouchEnd() {
            clearTimeout(this.holdTimer)
            this.endDrag()
            document.removeEventListener('touchmove', this.onTouchMove)
            document.removeEventListener('touchend', this.onTouchEnd)
        },
        startDrag(clientX, clientY) {
            this.isDragging = false

            this.holdTimer = setTimeout(() => {
                if (!this.isDragging) {
                    this.$emit('discardCard', this.index)
                }
            }, 1000)

            this.$el.style.cursor = 'grabbing'

            this.increaseHighestZIndex()
            this.zIndex = this.highestZIndex
            this.card.zIndex = this.zIndex

            this.shiftX = clientX - this.$el.getBoundingClientRect().left
            this.shiftY = clientY - this.$el.getBoundingClientRect().top
            this.moveAt(clientX, clientY)
        },
        drag(clientX, clientY) {
            this.isDragging = true

            if (this.isDragging) {
                this.moveAt(clientX, clientY)
            }
        },
        moveAt(pageX, pageY) {
            this.$el.style.left = pageX - this.shiftX + 'px'
            this.$el.style.top = pageY - this.shiftY + 'px'
        },
        endDrag() {
            this.isDragging = false
            this.$el.style.cursor = 'grab'
            this.shiftX = null
            this.shiftY = null

            this.card.left = this.$el.style.left
            this.card.top = this.$el.style.top
        },
        increaseHighestZIndex() {
            this.$emit('increase-highest-z-index')
        }
    }
}
</script>

<style scoped>
.card {
    width: 80px;
    height: 120px;
    border: 1px solid #000;
    background-color: white;
}
</style>
