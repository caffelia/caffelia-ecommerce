@pushOnce('scripts')
    <script
        type="text/x-template"
        id="v-checkout-address-form-template"
    >
        <div class="mt-2 max-md:mt-3">
            <x-caffelia-shop::form.control-group class="hidden">
                <x-caffelia-shop::form.control-group.control
                    type="text"
                    ::name="controlName + '.id'"
                    ::value="address.id"
                />
            </x-caffelia-shop::form.control-group>

            <!-- First Name -->
            <div class="grid grid-cols-2 gap-x-5 max-md:grid-cols-1">
                <x-caffelia-shop::form.control-group>
                    <x-caffelia-shop::form.control-group.label class="required !mt-0">
                        @lang('caffelia-shop::app.checkout.onepage.address.first-name')
                    </x-caffelia-shop::form.control-group.label>

                    <x-caffelia-shop::form.control-group.control
                        type="text"
                        ::name="controlName + '.first_name'"
                        ::value="address.first_name"
                        rules="required"
                        :label="trans('caffelia-shop::app.checkout.onepage.address.first-name')"
                        :placeholder="trans('caffelia-shop::app.checkout.onepage.address.first-name')"
                    />

                    <x-caffelia-shop::form.control-group.error ::name="controlName + '.first_name'" />
                </x-caffelia-shop::form.control-group>

                {!! view_render_event('bagisto.shop.checkout.onepage.address.form.first_name.after') !!}

                <!-- Last Name -->
                <x-caffelia-shop::form.control-group>
                    <x-caffelia-shop::form.control-group.label class="required !mt-0">
                        @lang('caffelia-shop::app.checkout.onepage.address.last-name')
                    </x-caffelia-shop::form.control-group.label>

                    <x-caffelia-shop::form.control-group.control
                        type="text"
                        ::name="controlName + '.last_name'"
                        ::value="address.last_name"
                        rules="required"
                        :label="trans('caffelia-shop::app.checkout.onepage.address.last-name')"
                        :placeholder="trans('caffelia-shop::app.checkout.onepage.address.last-name')"
                    />

                    <x-caffelia-shop::form.control-group.error ::name="controlName + '.last_name'" />
                </x-caffelia-shop::form.control-group>

                {!! view_render_event('bagisto.shop.checkout.onepage.address.form.last_name.after') !!}
            </div>

            <!-- Email -->
            <x-caffelia-shop::form.control-group>
                <x-caffelia-shop::form.control-group.label class="required !mt-0">
                    @lang('caffelia-shop::app.checkout.onepage.address.email')
                </x-caffelia-shop::form.control-group.label>

                <x-caffelia-shop::form.control-group.control
                    type="email"
                    ::name="controlName + '.email'"
                    ::value="address.email"
                    rules="required|email"
                    :label="trans('caffelia-shop::app.checkout.onepage.address.email')"
                    placeholder="email@example.com"
                />

                <x-caffelia-shop::form.control-group.error ::name="controlName + '.email'" />
            </x-caffelia-shop::form.control-group>

            {!! view_render_event('bagisto.shop.checkout.onepage.address.form.email.after') !!}

            <!-- Street Address -->
            <x-caffelia-shop::form.control-group>
                <x-caffelia-shop::form.control-group.label class="required !mt-0">
                    @lang('caffelia-shop::app.checkout.onepage.address.street-address')
                </x-caffelia-shop::form.control-group.label>

                <x-caffelia-shop::form.control-group.control
                    type="text"
                    ::name="controlName + '.address.[0]'"
                    ::value="address.address[0]"
                    rules="required|address"
                    :label="trans('caffelia-shop::app.checkout.onepage.address.street-address')"
                    :placeholder="trans('caffelia-shop::app.checkout.onepage.address.street-address')"
                />

                <x-caffelia-shop::form.control-group.error
                    class="mb-2"
                    ::name="controlName + '.address.[0]'"
                />

                @if (core()->getConfigData('customer.address.information.street_lines') > 1)
                    @for ($i = 1; $i < core()->getConfigData('customer.address.information.street_lines'); $i++)
                        <x-caffelia-shop::form.control-group.control
                            type="text"
                            ::name="controlName + '.address.[{{ $i }}]'"
                            rules="address"
                            :label="trans('caffelia-shop::app.checkout.onepage.address.street-address')"
                            :placeholder="trans('caffelia-shop::app.checkout.onepage.address.street-address')"
                        />

                        <x-caffelia-shop::form.control-group.error
                            class="mb-2"
                            ::name="controlName + '.address.[{{ $i }}]'"
                        />
                    @endfor
                @endif
            </x-caffelia-shop::form.control-group>

            {!! view_render_event('bagisto.shop.checkout.onepage.address.form.address.after') !!}

            <div class="grid grid-cols-2 gap-x-5 max-md:grid-cols-1">
                <!-- Country -->
                <x-caffelia-shop::form.control-group class="!mb-4">
                    <x-caffelia-shop::form.control-group.label class="{{ core()->isCountryRequired() ? 'required' : '' }} !mt-0">
                        @lang('caffelia-shop::app.checkout.onepage.address.country')
                    </x-caffelia-shop::form.control-group.label>

                    <x-caffelia-shop::form.control-group.control
                        type="select"
                        ::name="controlName + '.country'"
                        ::value="address.country"
                        v-model="selectedCountry"
                        rules="{{ core()->isCountryRequired() ? 'required' : '' }}"
                        :label="trans('caffelia-shop::app.checkout.onepage.address.country')"
                        :placeholder="trans('caffelia-shop::app.checkout.onepage.address.country')"
                        :disabled="true"
                    >
                        <option value="">
                            @lang('caffelia-shop::app.checkout.onepage.address.select-country')
                        </option>

                        <option
                            v-for="country in countries"
                            :value="country.code"
                        >
                            @{{ country.name }}
                        </option>
                    </x-caffelia-shop::form.control-group.control>

                    <x-caffelia-shop::form.control-group.error ::name="controlName + '.country'" />
                </x-caffelia-shop::form.control-group>

                {!! view_render_event('bagisto.shop.checkout.onepage.address.form.country.after') !!}

                <!-- State -->
                <x-caffelia-shop::form.control-group>
                    <x-caffelia-shop::form.control-group.label class="{{ core()->isStateRequired() ? 'required' : '' }} !mt-0">
                        @lang('caffelia-shop::app.checkout.onepage.address.state')
                    </x-caffelia-shop::form.control-group.label>

                    <template v-if="states">
                        <template v-if="haveStates">
                            <x-caffelia-shop::form.control-group.control
                                type="select"
                                ::name="controlName + '.state'"
                                rules="{{ core()->isStateRequired() ? 'required' : '' }}"
                                ::value="address.state"
                                :label="trans('caffelia-shop::app.checkout.onepage.address.state')"
                                :placeholder="trans('caffelia-shop::app.checkout.onepage.address.state')"
                            >
                                <option value="">
                                    @lang('caffelia-shop::app.checkout.onepage.address.select-state')
                                </option>

                                <option
                                    v-for='(state, index) in sortedStates'
                                    :value="state.code"
                                >
                                    @{{ state.default_name }}
                                </option>
                            </x-caffelia-shop::form.control-group.control>
                        </template>

                        <template v-else>
                            <x-caffelia-shop::form.control-group.control
                                type="text"
                                ::name="controlName + '.state'"
                                ::value="address.state"
                                rules="{{ core()->isStateRequired() ? 'required' : '' }}"
                                :label="trans('caffelia-shop::app.checkout.onepage.address.state')"
                                :placeholder="trans('caffelia-shop::app.checkout.onepage.address.state')"
                            />
                        </template>
                    </template>

                    <x-caffelia-shop::form.control-group.error ::name="controlName + '.state'" />
                </x-caffelia-shop::form.control-group>

                {!! view_render_event('bagisto.shop.checkout.onepage.address.form.state.after') !!}
            </div>

            <div class="grid grid-cols-2 gap-x-5 max-md:grid-cols-1">
                <!-- City -->
                <x-caffelia-shop::form.control-group>
                    <x-caffelia-shop::form.control-group.label class="required !mt-0">
                        @lang('caffelia-shop::app.checkout.onepage.address.city')
                    </x-caffelia-shop::form.control-group.label>

                    <x-caffelia-shop::form.control-group.control
                        type="text"
                        ::name="controlName + '.city'"
                        ::value="address.city"
                        rules="required"
                        :label="trans('caffelia-shop::app.checkout.onepage.address.city')"
                        :placeholder="trans('caffelia-shop::app.checkout.onepage.address.city')"
                    />

                    <x-caffelia-shop::form.control-group.error ::name="controlName + '.city'" />
                </x-caffelia-shop::form.control-group>

                {!! view_render_event('bagisto.shop.checkout.onepage.address.form.city.after') !!}

                <!-- Postcode -->
                <x-caffelia-shop::form.control-group>
                    <x-caffelia-shop::form.control-group.label class="{{ core()->isPostCodeRequired() ? 'required' : '' }} !mt-0">
                        @lang('caffelia-shop::app.checkout.onepage.address.postcode')
                    </x-caffelia-shop::form.control-group.label>

                    <x-caffelia-shop::form.control-group.control
                        type="text"
                        ::name="controlName + '.postcode'"
                        ::value="address.postcode"
                        rules="{{ core()->isPostCodeRequired() ? 'required' : '' }}|postcode"
                        :label="trans('caffelia-shop::app.checkout.onepage.address.postcode')"
                        :placeholder="trans('caffelia-shop::app.checkout.onepage.address.postcode')"
                    />

                    <x-caffelia-shop::form.control-group.error ::name="controlName + '.postcode'" />
                </x-caffelia-shop::form.control-group>

                {!! view_render_event('bagisto.shop.checkout.onepage.address.form.postcode.after') !!}
            </div>

            <!-- Phone Number -->
            <x-caffelia-shop::form.control-group>
                <x-caffelia-shop::form.control-group.label class="required !mt-0">
                    @lang('caffelia-shop::app.checkout.onepage.address.telephone')
                </x-caffelia-shop::form.control-group.label>

                <x-caffelia-shop::form.control-group.control
                    type="text"
                    ::name="controlName + '.phone'"
                    ::value="address.phone"
                    rules="required|numeric"
                    :label="trans('caffelia-shop::app.checkout.onepage.address.telephone')"
                    :placeholder="trans('caffelia-shop::app.checkout.onepage.address.telephone')"
                />

                <x-caffelia-shop::form.control-group.error ::name="controlName + '.phone'" />
            </x-caffelia-shop::form.control-group>

            {!! view_render_event('bagisto.shop.checkout.onepage.address.form.phone.after') !!}
        </div>
    </script>

    <script type="module">
        app.component('v-checkout-address-form', {
            template: '#v-checkout-address-form-template',

            props: {
                controlName: {
                    type: String,
                    required: true,
                },

                address: {
                    type: Object,

                    default: () => ({
                        id: 0,
                        first_name: '',
                        last_name: '',
                        email: '',
                        address: [],
                        country: 'CO',
                        state: '',
                        city: '',
                        postcode: '',
                        phone: '',
                    }),
                },
            },

            data() {
                return {
                    selectedCountry: this.address.country,

                    countries: [],

                    states: null,
                }
            },

            computed: {
                haveStates() {
                    return !! this.states[this.selectedCountry]?.length;
                },

                sortedStates() {
                    if (! this.states?.[this.selectedCountry]) {
                        return [];
                    }

                    return this.states[this.selectedCountry].slice().sort((a, b) => a.default_name.localeCompare(b.default_name));
                },
            },

            mounted() {
                this.getCountries();

                this.getStates();

                this.address.country = 'CO';

                this.selectedCountry = 'CO';
            },

            methods: {
                getCountries() {
                    this.$axios.get("{{ route('shop.api.core.countries') }}")
                        .then(response => {
                            this.countries = response.data.data;
                        })
                        .catch(() => {});
                },

                getStates() {
                    this.$axios.get("{{ route('shop.api.core.states') }}")
                        .then(response => {
                            this.states = response.data.data;
                        })
                        .catch(() => {});
                },
            }
        });
    </script>
@endPushOnce
