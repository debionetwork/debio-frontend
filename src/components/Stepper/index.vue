<template>
  <div :class="computeClasses">
    <ul :class="computeDirection">
      <li
        v-for="(step, idx) in stepperItems"
        :key="idx"
        :class="['stepper__item', { 'stepper__item--active': step.selected }]"
        :aria-selected="step.selected"
      >
        <div class="stepper__item-bullet"></div>
        <div
          class="stepper__item-name"
          :aria-label="step.name"
          :title="step.name"
        >
          {{ step.name }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
const directionValidator = (direction) => ["vertical", "horizontal"].includes(direction)
const sizeValidator = (size) => ["small", "medium", "large"].includes(size)

export default {
  props: {
    direction: { type: String, default: "horizontal", validator: (v) => directionValidator(v) },
    size: { type: String, default: "small", validator: (v) => sizeValidator(v) },
    stepperItems: {
      type: Array,
      default: () => [],
      validator: (v) => v.every(lv => Object.keys(lv).includes("selected"))
    }
  },

  computed: {
    computeClasses() {
      return [ "stepper", "stepper--" + this.size ]
    },

    computeDirection() {
      return this.direction == "vertical"
        ? "stepper__lists--vertical"
        : "stepper__lists"
    }
  }

}
</script>

<style lang="scss">
.stepper {
  // Variants
  &--small {
    .stepper__item-name {
      font-size: 9px;
      text-align: center;
    }

    .stepper__item-bullet {
      width: 16px;
      height: 16px;

      &::after {
        left: 0;
      }
    }

    .stepper__item {
      &:not(:first-child) {
        &::after {
          right: 45%;
          top: calc(100% - 9px);
          width: calc((100% + 25px) + 8%);
        }
      }
    }
  }

  &--medium {
    .stepper__item-name {
      font-size: 18px;
      text-align: center;
    }

    .stepper__item-bullet {
      width: 24px;
      height: 24px;
    }

    .stepper__item {
      &:not(:first-child) {
        &::after {
          right: 50%;
          top: calc(100% - 13px);
          width: calc(120% - 20px);
        }
      }
    }
  }

  &--large {
    .stepper__item-name {
      font-size: 27px;
    }

    .stepper__item-bullet {
      width: 32px;
      height: 32px;
    }
  }

  // Direction
  &--vertical {
    flex-direction: column;
  }

  // FIXME: Refactor
  .stepper__lists--vertical {
    padding-left: 0px !important;

    .stepper__item {
      flex-direction: row;
      align-items: center;
      margin-bottom: 24px;
      &:not(:first-child) {
        &::after {
          content: "";
          left: 10px;
          display: block;
          position: absolute;
          top: -36px;
          z-index: 1;
          width: 3px;;
          height: 48px;
          background: #afafaf;
        }
      }
    }

    .stepper__item-bullet {
      min-width: 24px;
      margin-top: 0px;
    }

    .stepper__item-name {
      margin-left: 12px; 
      text-align: left;
      line-height: 24px;
    }
  }
  
  &__lists {
    display: flex;
    gap: 0 20px;
    justify-content: space-between;
    padding-left: 0 !important;
  }

  &__item {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;

    &--active {
      .stepper__item-bullet {
        background: #13C2CD;
        border-color: #13C2CD;
      }

      &::after {
        background: #13C2CD !important;
      }
    }

    &:not(:first-child) {
      &::after {
        content: "";
        display: block;
        position: absolute;
        top: 77%;
        z-index: 1;
        width: calc(100% + 32px);
        height: 2px;
        background: #afafaf;
      }
    }
  }

  &__item-bullet {
    position: relative;
    z-index: 2;
    width: 16px;
    height: 16px;
    border: solid 2px #afafaf;
    background: #afafaf;
    border-radius: 50%;
    margin-top: 11px;
    display: flex;
    justify-content: center;
    align-items: center;

    &::after {
      content: "";
      display: block;
      position: relative;
      left: 1px;
      top: -1px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  }

  &__item-name {
    font-weight: 600;
    line-height: 11px;
  }

}
</style>
