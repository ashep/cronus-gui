import * as React from "react";
import {Link, route} from "preact-router";
import * as BTSvc from "../../service/Bluetooth";
import * as Config from "../../service/Config";
import {signal, Signal} from "@preact/signals";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {debounce} from '@mui/material/utils';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {useTranslation} from "react-i18next";
import LocationIcon from "@mui/icons-material/LocationOn";

interface Props {
    btConnStatus: BTSvc.ConnStatus
    cfg: Config.Service
}

interface State {
}

interface AutocompleteOption {
    id: string;
    shortAddress: string;
    address: string;
    latitude: number;
    longitude: number;
}

interface GooglePlacePredictionItemText {
    text: string;
}

interface GooglePlacePredictionItem {
    placeId: string;
    text: GooglePlacePredictionItemText;
}

interface GooglePlacePrediction {
    placePrediction: GooglePlacePredictionItem;
}

interface GooglePlaceSuggestions {
    suggestions: Array<GooglePlacePrediction>;
}

interface GooglePlaceInfoLocation {
    latitude: number;
    longitude: number;
}

interface GooglePlaceInfo {
    id: string,
    formattedAddress: string,
    shortFormattedAddress: string,
    location: GooglePlaceInfoLocation;
}

export default class Home extends React.Component<Props, State> {
    private gmapsAPIKey = "AIzaSyC7sfg7lEsi3wey0p7A9sz-tkcVMkBsqo8";
    private suggestionsLoading: Signal<boolean> = signal(false);
    private autocompleteOptions: Signal<Array<AutocompleteOption>> = signal([]);
    private selectVisible: Signal<boolean> = signal(false);

    private async fetchSuggestions(input: string): Promise<void> {
        if (!input) {
            return;
        }

        try {
            this.suggestionsLoading.value = true;

            const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": this.gmapsAPIKey,
                },
                body: JSON.stringify({
                    input: input,
                    includedPrimaryTypes: ["(cities)"],
                }),
            });

            if (!res.ok) {
                throw new Error(`fetchSuggestions failed with status ${res.status}`);
            }
            const data: GooglePlaceSuggestions = await res.json();

            if (!data.suggestions) {
                return;
            }

            const result = new Array<AutocompleteOption>;
            for (const place of data.suggestions) {
                const placeInfo = await this.fetchPlaceInfo(place.placePrediction.placeId)
                result.push({
                    id: placeInfo.id,
                    shortAddress: placeInfo.shortFormattedAddress,
                    address: placeInfo.formattedAddress,
                    latitude: placeInfo.location.latitude,
                    longitude: placeInfo.location.longitude,
                })
            }
            this.autocompleteOptions.value = result;
        } finally {
            this.suggestionsLoading.value = false;
        }
    }

    private async fetchPlaceInfo(placeId: string): Promise<GooglePlaceInfo> {
        if (!placeId) {
            throw new Error("fetchPlaceInfo called with falsy placeId");
        }

        const res = await fetch("https://places.googleapis.com/v1/places/" + placeId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": this.gmapsAPIKey,
                "X-Goog-FieldMask": "id,formattedAddress,shortFormattedAddress,location",
            },
        })

        if (!res.ok) {
            throw new Error(`fetchPlaceInfo failed with status ${res.status}`);
        }

        return await res.json();
    }

    render() {
        const {t} = useTranslation();

        return <Grid container
                     direction="column"
                     alignItems="center"
                     justifyContent="center"
                     sx={{minHeight: '100vh'}}
        >
            <CssBaseline/>

            {this.props.btConnStatus != BTSvc.ConnStatus.CONNECTED
                ?
                <Box>
                    You're not connected to your Cronus device.
                    Click <Link href={"/device"}>here</Link> to connect.
                </Box>
                :
                <Stack direction={"column"} spacing={3}>
                    <Typography sx={{width: 300}}>
                        <b>{t("currentLocation")}:</b> {this.props.cfg.LocationName}
                    </Typography>

                    {!this.selectVisible.value &&
                        <Button variant={"outlined"} startIcon={<LocationIcon/>}
                                onClick={() => this.selectVisible.value = true}>
                            {t("changeLocation")}
                        </Button>
                    }

                    {this.selectVisible.value &&
                        <FormControl variant="outlined">
                            <Autocomplete
                                sx={{width: 300}}
                                loading={this.suggestionsLoading.value}
                                options={this.autocompleteOptions.value}
                                clearOnBlur={true}
                                getOptionKey={(opt) => opt.id}
                                getOptionLabel={(opt) => opt.address}
                                filterOptions={options => options}
                                renderInput={(params) => {
                                    // @ts-ignore
                                    return <TextField {...params} label="New location" variant="outlined"/>
                                }}
                                onInputChange={debounce(async (_, value, reason) => {
                                    if (reason != "input") {
                                        return;
                                    }
                                    await this.fetchSuggestions(value);
                                }, 750)}
                                onChange={async (_, value, reason) => {
                                    if (reason != "selectOption") {
                                        return
                                    }
                                    await this.props.cfg.SetLocationName(value.address);
                                    await this.props.cfg.SetLocationLat(value.latitude);
                                    await this.props.cfg.SetLocationLng(value.longitude);
                                    this.selectVisible.value = false;
                                }}
                            />
                        </FormControl>
                    }

                    <Button variant={"outlined"} startIcon={<ArrowBackIcon/>} onClick={() => route("/device")}>
                        {t("back")}
                    </Button>
                </Stack>
            }
        </Grid>
    }
}
