<v-rental-slots :bookingProduct = "{{ $bookingProduct }}"></v-rental-slots>

@pushOnce('scripts')
    <script
        type="text/x-template"
        id="v-rental-slots-template"
    >
        <div class="grid grid-cols-1 gap-2.5">
            <template v-if="renting_type == 'daily_hourly'">
                <x-caffelia-shop::form.control-group.label class="required w-full">
                    @lang('caffelia-shop::app.products.view.type.booking.rental.choose-rent-option')
                </x-caffelia-shop::form.control-group.label>

                <div class="mb-3 grid grid-cols-2 gap-2.5">
                    <!-- Daily Radio Button -->
                    <span class="flex gap-x-4">
                        <input
                            type="radio"
                            class="peer hidden"
                            id="booking[daily]"
                            name="booking[renting_type]"
                            value="daily"
                            v-model="sub_renting_type"
                        >

                        <label
                            class="icon-radio-unselect peer-checked:icon-radio-select text-2xl text-navyBlue"
                            for="booking[daily]"
                        >
                        </label>

                        <label
                            class="cursor-pointer text-[#6E6E6E]"
                            for="booking[daily]"
                        >
                            @lang('caffelia-shop::app.products.view.type.booking.rental.daily-basis')
                        </label>
                    </span>

                    <!-- Hourly Radio Button -->
                    <span class="flex gap-x-4">
                        <input
                            type="radio"
                            class="peer hidden"
                            id="booking[hourly]"
                            name="booking[renting_type]"
                            value="hourly"
                            v-model="sub_renting_type"
                        >

                        <label
                            class="icon-radio-unselect peer-checked:icon-radio-select text-2xl text-navyBlue"
                            for="booking[hourly]"
                        >
                        </label>

                        <label
                            class="cursor-pointer text-[#6E6E6E]"
                            for="booking[hourly]"
                        >
                            @lang('caffelia-shop::app.products.view.type.booking.rental.hourly-basis')
                        </label>
                    </span>
                </div>
            </template>

            <div class="flex flex-col gap-2.5" v-if="renting_type != 'daily' && sub_renting_type == 'hourly'">
                <div  class="grid gap-1.5">
                    <label class="required">
                        @lang('caffelia-shop::app.products.view.type.booking.rental.select-slot')
                    </label>

                    <div class="flex gap-2.5">
                        <!-- Select Slot Date -->
                        <x-caffelia-shop::form.control-group class="!mb-0 w-full">
                            <x-caffelia-shop::form.control-group.label class="hidden">
                                @lang('caffelia-shop::app.products.view.type.booking.rental.select-date')
                            </x-caffelia-shop::form.control-group.label>

                            <x-caffelia-shop::form.control-group.control
                                type="date"
                                name="booking[date]"
                                class="max-sm!px-2 max-sm!text-xs"
                                rules="required"
                                :label="trans('caffelia-shop::app.products.view.type.booking.rental.select-date')"
                                :placeholder="trans('caffelia-shop::app.products.view.type.booking.rental.select-date')"
                                data-min-date="today"
                                @change="dateSelected($event)"
                            />

                            <x-caffelia-shop::form.control-group.error control-name="booking[date]" />
                        </x-caffelia-shop::form.control-group>

                        <!-- Select Slot -->
                        <x-caffelia-shop::form.control-group class="!mb-0 w-full">
                            <x-caffelia-shop::form.control-group.label class="hidden">
                                @lang('caffelia-shop::app.products.view.type.booking.rental.select-slot')
                            </x-caffelia-shop::form.control-group.label>

                            <x-caffelia-shop::form.control-group.control
                                type="select"
                                class="!mb-1"
                                name="booking[slot]"
                                rules="required"
                                v-model="selected_slot"
                                :label="trans('caffelia-shop::app.products.view.type.booking.rental.select-date')"
                                :placeholder="trans('caffelia-shop::app.products.view.type.booking.rental.select-date')"
                            >
                                <option value="">
                                    @lang('caffelia-shop::app.products.view.type.booking.rental.select-slot')
                                </option>
                                
                                <option v-if="! slots?.length">
                                    @lang('caffelia-shop::app.products.view.type.booking.rental.no-slots-available')
                                </option>

                                <option
                                    v-for="(slot, index) in slots"
                                    :value="index"
                                    v-text="slot.time"
                                >
                                </option>
                            </x-caffelia-shop::form.control-group.control>

                            <x-caffelia-shop::form.control-group.error control-name="booking[slot]" />
                        </x-caffelia-shop::form.control-group>
                    </div>
                </div>

                <div
                    class="grid gap-1.5"
                    v-if="parseInt(slots[selected_slot] && slots[selected_slot]?.slots?.length)"
                >
                    <label class="required">
                        @lang('caffelia-shop::app.products.view.type.booking.rental.select-rent-time')
                    </label>

                    <div class="flex gap-2.5">
                        <!-- Select Time Slot From -->
                        <x-caffelia-shop::form.control-group class="!mb-0 w-full">
                            <x-caffelia-shop::form.control-group.label class="hidden">
                                @lang('caffelia-shop::app.products.view.type.booking.rental.select-date')
                            </x-caffelia-shop::form.control-group.label>

                            <x-caffelia-shop::form.control-group.control
                                type="select"
                                name="booking[slot][from]"
                                rules="required"
                                :label="trans('caffelia-shop::app.products.view.type.booking.rental.select-date')"
                                :placeholder="trans('caffelia-shop::app.products.view.type.booking.rental.select-date')"
                            >
                                <option value="">
                                    @lang('caffelia-shop::app.products.view.type.booking.rental.select-time-slot')
                                </option>

                                <option
                                    v-for="slot in slots[selected_slot]?.slots"
                                    :value="slot.from_timestamp"
                                    v-text="slot.from"
                                >
                                </option>
                            </x-caffelia-shop::form.control-group.control>

                            <x-caffelia-shop::form.control-group.error control-name="booking[slot][from]" />
                        </x-caffelia-shop::form.control-group>

                        <!-- Select Time Slot To -->
                        <x-caffelia-shop::form.control-group class="!mb-0 w-full">
                            <x-caffelia-shop::form.control-group.label class="hidden">
                                @lang('caffelia-shop::app.products.view.type.booking.rental.slot')
                            </x-caffelia-shop::form.control-group.label>

                            <x-caffelia-shop::form.control-group.control
                                type="select"
                                name="booking[slot][to]"
                                rules="required"
                                :label="trans('caffelia-shop::app.products.view.type.booking.rental.slot')"
                                :placeholder="trans('caffelia-shop::app.products.view.type.booking.rental.slot')"
                            >
                                <option value="">
                                    @lang('caffelia-shop::app.products.view.type.booking.rental.select-time-slot')
                                </option>

                                <option
                                    v-for="slot in slots[selected_slot]?.slots"
                                    :value="slot?.to_timestamp"
                                    v-text="slot.to"
                                >
                                </option>
                            </x-caffelia-shop::form.control-group.control>

                            <x-caffelia-shop::form.control-group.error control-name="booking[slot][to]" />
                        </x-caffelia-shop::form.control-group>
                    </div>
                </div>
            </div>

            <div v-else>
                <label class="required">
                    @lang('caffelia-shop::app.products.view.type.booking.rental.select-date')
                </label>

                <div class="flex gap-2.5">
                    <!-- Select Date From -->
                    <x-caffelia-shop::form.control-group class="!mb-0 w-full">
                        <x-caffelia-shop::form.control-group.label class="hidden">
                            @lang('caffelia-shop::app.products.view.type.booking.rental.from')
                        </x-caffelia-shop::form.control-group.label>

                        <x-caffelia-shop::form.control-group.control
                            type="date"
                            name="booking[date_from]"
                            rules="required"
                            :label="trans('caffelia-shop::app.products.view.type.booking.rental.from')"
                            :placeholder="trans('caffelia-shop::app.products.view.type.booking.rental.from')"
                            data-min-date="today"
                            @change="dateSelected($event)"
                        />

                        <x-caffelia-shop::form.control-group.error control-name="booking[date_from]" />
                    </x-caffelia-shop::form.control-group>

                    <!-- Select Date To -->
                    <x-caffelia-shop::form.control-group class="!mb-0 w-full">
                        <x-caffelia-shop::form.control-group.label class="hidden">
                            @lang('caffelia-shop::app.products.view.type.booking.rental.to')
                        </x-caffelia-shop::form.control-group.label>

                        <x-caffelia-shop::form.control-group.control
                            type="date"
                            name="booking[date_to]"
                            rules="required"
                            :label="trans('caffelia-shop::app.products.view.type.booking.rental.to')"
                            :placeholder="trans('caffelia-shop::app.products.view.type.booking.rental.to')"
                            data-min-date="today"
                            @change="dateSelected($event)"
                        />

                        <x-caffelia-shop::form.control-group.error control-name="booking[date_to]" />
                    </x-caffelia-shop::form.control-group>
                </div>
            </div>
        </div>
    </script>

    <script type="module">
        app.component('v-rental-slots', {
            template: '#v-rental-slots-template',

            props: ['bookingProduct'],

            data() {
                return {
                    renting_type: "{{ $bookingProduct->rental_slot->renting_type }}",

                    sub_renting_type: 'hourly',

                    slots: [],

                    selected_slot: '',
                }
            },

            methods: {
                dateSelected(params) {
                    let date = params.target.value;

                    this.$axios.get(`{{ route('shop.booking-product.slots.index', '') }}/${this.bookingProduct.id}`, {
                        params: { date }
                    })
                        .then((response) => {
                            this.selected_slot = '';
                            
                            this.slots = response.data.data;
                        })
                        .catch(error => {
                            if (error.response.status == 422) {
                                setErrors(error.response.data.errors);
                            }
                        });
                },
            },
        });
    </script>
@endpushOnce